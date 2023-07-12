import { FdpStorage } from "@fairdatasociety/fdp-storage";
import { utils } from "ethers";
import { saveAs } from "file-saver";
import { config } from "./config";
import {
  message,
  savedMnemonic,
  STATE,
  state,
  todoItems,
  user,
  wallet,
} from "./store";
import moment from "moment";

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

// export const apiHost = () => {
//   return window.location.href.split("/#/")[0].replace(/\/$/, "") + "/api";
// };
const apiHost = "http://localhost:9090";

export const registerAccount = async (username, password) => {
  const fdp = new FdpStorage(config.beeUrl, config.postageBatchId);
  console.log({ username, password });
  console.log(username, password, "mmmm");
  const _wallet = fdp.account.createWallet();
  console.log(apiHost, "lll");
  const ENDPOINT = "/v2/user/signup";
  const FAIROS_HOST = apiHost;
  console.log(FAIROS_HOST, "kkkk");
  let url = `${FAIROS_HOST}${ENDPOINT}`;
  console.log(url, "urlssss");
  let data = {
    userName: username,
    password,
    mnemonic: _wallet.mnemonic.phrase,
  };
  console.log(data);
  let response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  let json = await response.json();
  if (response.ok) {
    console.log("ok", { response, json });
    initTodos().then((todos) => {
      console.log({ todos });
      todoItems.set(todos);
      wallet.set({
        address: _wallet.address,
        mnemonic: _wallet.mnemonic.phrase,
      });
      user.set(username);
    });
  } else {
    state.set(STATE.ERROR);
    message.set(json.message);
    console.error("error", { response, json });
  }
  topUpAddress(fdp, _wallet.address, "0.01").then(async () => {
    let response = await fetch(url, {
      headers,
      method: "POST",
      body: JSON.stringify(data),
    });
    let json = await response.json();
    if (response.ok) {
      console.log("ok", { response, json });
      initTodos().then((todos) => {
        console.log({ todos });
        todoItems.set(todos);
        wallet.set({
          address: _wallet.address,
          mnemonic: _wallet.mnemonic.phrase,
        });
        user.set(username);
      });
    } else {
      state.set(STATE.ERROR);
      message.set(json.message);
      console.error("error", { response, json });
    }
  });
};

export const initTodos = () => {
  return createAppPod().then(() => {
    console.log(config.todoAppNamespace + ": AppPod created");
    return openAppPod().then(() => {
      console.log(config.todoAppNamespace + ": AppPod opened");
      return createAppDir().then(() => {
        console.log(config.todoItemsDirectory + ": Directory created opened");
        return listTodos();
      });
    });
  });
};
export const createAppPod = async () => {
  let data = {
    podName: config.todoAppNamespace,
  };

  const ENDPOINT = "/v1/pod/new";
  const FAIROS_HOST = apiHost();
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};
export const openAppPod = async () => {
  let data = {
    podName: config.todoAppNamespace,
  };

  const ENDPOINT = "/v1/pod/open";
  const FAIROS_HOST = apiHost();
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};
export const createAppDir = async () => {
  let data = {
    podName: config.todoAppNamespace,
    dirPath: config.todoItemsDirectory,
  };

  let ENDPOINT = "/v1/dir/mkdir";
  const FAIROS_HOST = apiHost();
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    console.error({ response, json });
  }
};

export const listTodos = async () => {
  let headers = {
    "Content-Type": "application/json",
  };

  let data = {
    podName: config.todoAppNamespace,
    dirPath: config.todoItemsDirectory,
  };

  let ENDPOINT = "/v1/dir/ls";
  const FAIROS_HOST = apiHost();
  let response = await fetch(
    FAIROS_HOST + ENDPOINT + "?" + new URLSearchParams(data),
    {
      method: "GET",
      headers,
    }
  );

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    let res = (json.files || []).map(async ({ name }) => {
      return readTodo(name);
    });
    return Promise.all(res);
  } else {
    console.error({ response, json });
  }
};

export const readTodo = async (todofile) => {
  let headers = {
    "Content-Type": "application/json",
  };

  let data = {
    podName: config.todoAppNamespace,
    filePath: config.todoItemsDirectory + "/" + todofile,
  };

  let FAIROS_HOST = apiHost();
  let ENDPOINT = "/v1/file/download";

  let response = await fetch(
    FAIROS_HOST + ENDPOINT + "?" + new URLSearchParams(data),
    {
      credentials: "include",
      method: "GET",
      headers,
    }
  );

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    return json;
  } else {
    console.error({ response, json });
  }
};

export async function topUpAddress(fdp, address, amountInEther) {
  const ens = fdp.ens;
  const accounts = await ens.provider.listAccounts();
  const balances = [];
  accounts.map(async (addr, i) => {
    const balance = await await ens.provider.getBalance(addr);
    balances[i] = Number(balance._hex);
  });
  console.log({ accounts, balances });
  console.log(ens, "llll");
  const account = (await ens.provider.listAccounts())[0];
  console.log(`Topping ${address} with ${amountInEther} ETH...`);
  return ens.provider
    .send("eth_sendTransaction", [
      {
        from: account,
        to: address,
        value: utils.hexlify(utils.parseEther(amountInEther)),
      },
    ])
    .then((txHash) => {
      return ens.provider.waitForTransaction(txHash).then(() => {
        console.log("Topped! ", { txHash });
        return txHash;
      });
    });
}
