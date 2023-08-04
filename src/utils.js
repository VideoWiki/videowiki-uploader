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

export const apiHost = () => {
  // let url = window.location.href.replace(/^https:\/\/fairos\.video\.wiki\/.*$/, "http://localhost:3000/api");
  let url = "https://fairos.video.wiki/api"
  return url;
};
// const apiHost() = "http://localhost:9090";

export const registerAccount = async (username, password) => {
  const fdp = new FdpStorage(config.beeUrl, config.postageBatchId);
  console.log({ username, password });
  console.log(username, password, "mmmm");
  const _wallet = fdp.account.createWallet();
  console.log(apiHost(), "lll");
  const ENDPOINT = "/v2/user/signup";
  const FAIROS_HOST = apiHost();
  console.log(FAIROS_HOST, "kkkk");
  let url = `${FAIROS_HOST}${ENDPOINT}`;
  console.log(url, "urlssss");
  let data = {
    userName: username,
    password,
    mnemonic: _wallet.mnemonic.phrase,
  };
  console.log(data);
  // return new Promise(async (res, rej) => {
  let response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  let json = await response.json();
  // return json;
  if (response.ok) {
    alert("ok", { response, json });
    const todos = await initTodos();
    // return todos;
    // initTodos().then((todos) => {
    console.log({ todos });
    todoItems.set(todos);
    // res(json);
    wallet.set({
      address: _wallet.address,
      mnemonic: _wallet.mnemonic.phrase,
    });
    user.set(username);

    // });
  } else {
    state.set(STATE.ERROR);
    message.set(json.message);
    console.error("error", { response, json });
  }
  await topUpAddress(fdp, _wallet.address, "0.01")
  let response1 = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  let json1 = await response1.json();
  if (response1.ok) {
    console.log("ok", { response1, json1 });
    const todos = await initTodos(username);
    // initTodos().then((todos) => {
    console.log({ todos });
    todoItems.set(todos);
    wallet.set({
      address: _wallet.address,
      mnemonic: _wallet.mnemonic.phrase,
    });
    user.set(username);
    let userDict = {
      userName: username,
      address: _wallet.address,
      mnemonic: _wallet.mnemonic.phrase,
      todos: []
    };
    return userDict;
    // });

  } else {
    state.set(STATE.ERROR);
    message.set(json1.message);
    console.error("error", { response, json1 });
  }
  // });
  // });
};

export const initTodos = async (userName) => {
  return createAppPod(userName).then(() => {
    console.log(userName + ": AppPod created");
    return openAppPod(userName).then(() => {
      console.log(userName + ": AppPod opened");
      return createAppDir(userName).then(() => {
        console.log(userName + ": Directory created opened");
        return listTodos(userName);
      });
    });
  });
};

export const createAppPod = async (userName) => {
  let data = {
    podName: userName,
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
export const openAppPod = async (userName) => {
  let data = {
    podName: userName,
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
export const createAppDir = async (userName) => {
  let data = {
    podName: userName,
    dirPath: "/" + userName,
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

export const listTodos = async (userName) => {
  let headers = {
    "Content-Type": "application/json",
  };

  let data = {
    podName: userName,
    dirPath: "/" + userName,
  };

  let ENDPOINT = "/v1/dir/ls";
  const FAIROS_HOST = apiHost();

  try {
    let response = await fetch(
      FAIROS_HOST + ENDPOINT + "?" + new URLSearchParams(data),
      {
        method: "GET",
        headers,
      }
    );

    let json = await response.json();

    if (response.ok) {
      console.log({ response, json }, "33336666");
      let res = await Promise.all((json.files || []).map(async ({ name }) => {
        return await readTodo(name, userName);
      }));

      return res;
    } else {
      console.error({ response, json });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};


export const readTodo = async (todofile, userName) => {
  let headers = {
    "Content-Type": "application/json",
  };

  let data = {
    podName: userName,
    filePath: "/" + userName + "/" + todofile,
  };
  console.warn(data, "here33333")
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
  let json = await response.blob();
  console.warn("here3333344444")
  if (response.ok) {
    console.log({ response, json });
    console.warn("here triggered", response, json)
    let jsonResponse = {
      name: todofile,
      blob: json
    };
    return jsonResponse;
  } else {
    console.error({ response, json });
  }
};

export async function topUpAddress(fdp, address, amountInEther) {
  const ens = fdp.ens;
  console.log(ens, "ensss")
  ens.config.rpcUrl = "https://brpc.video.wiki"
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

export const loginAccount = async (userName, password) => {
  const ENDPOINT = "/v2/user/login";
  const FAIROS_HOST = apiHost();
  let data = {
    userName,
    password,
  };
  console.log("ppppp", userName, password);
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  console.log("llllll", response);

  let json = await response.json();
  console.log("jjkkkk", json);

  if (response.ok) {
    try {
      // Assuming `initTodos()` returns the `todos` array
      let todos = await initTodos();
      // Convert the Blob array to an array of data URLs
      console.warn(todos, "dhudififii")
      const dataURLs = await Promise.all(
        todos.map((todo) => {
          return {
            name: todo.name,
            dataURL: URL.createObjectURL(todo.blob),
            type: todo.blob.type, // Add the 'type' of the todo blob here
          };
        })
      );

      // Initialize 'todoItems' with the data URLs
      todoItems.set(dataURLs);
      console.warn(dataURLs, "whwhwhwh");
      console.warn(todos, "lllhgff");
      // Initializing the 'todoItems' variable with the 'todos' array
      todoItems.set(todos);
      state.set(STATE.INFO);
      wallet.set({ address: json.address, mnemonic: "" });
      user.set(userName);

      // Constructing the array of objects with the desired values
      let todosArray = dataURLs.map((todo, index) => {
        return {
          name: todos[index].name,
          dataURL: todo.dataURL,
          type: todo.type, // Include the 'type' in the todosArray
        };
      });

      console.log(todosArray, "array of todos");
      return {
        userName: userName,
        address: json.address,
        todoItems: todosArray,
      };
    } catch (error) {
      console.error("Error initializing todos", error);
    }
  } else {
    console.error({ response, json });
  }

  // If something goes wrong or the response is not ok, return null
  return null;
};

export const addTodo = async (todo, todos, userName) => {
  console.log({ todo, todos });
  console.log("aaaaaaaaa");
  const fileInput = document.getElementById("todo");
  const file = fileInput.files[0];
  console.log(file.type);
  if (!file) {
    return todos;
  }

  const blob = new Blob([file], {
    type: file.type,
  });

  const formData = new FormData();
  formData.append("files", blob, "todo_" + todo.id);
  formData.set("podName", userName);
  formData.set("dirPath", "/" + userName);
  formData.set("blockSize", "1Mb");

  const ENDPOINT = "/v1/file/upload";
  let response = await fetch(apiHost() + ENDPOINT, {
    credentials: "include",
    method: "POST",
    body: formData,
  });

  let json = await response.json();
  if (response.ok) {
    let jsonResponse = {
      name: "todo_" + todo.id,
      blob: blob,
      type: file.type, // Add the type property
      dataURL: URL.createObjectURL(blob), // Set the 'dataURL' property
    };
    console.log(jsonResponse, "0002222233333");
    todos.push(jsonResponse);
  } else {
    console.error({ response, json });
  }
  return todos;
};

export const deleteTodo = async (deleteTodoName, todos, userName) => {
  const data = {
    podName: userName,
    filePath: `${"/" + userName}/${deleteTodoName}`,
  };

  const FAIROS_HOST = apiHost();
  const ENDPOINT = "/v1/file/delete";

  const response = await fetch(FAIROS_HOST + ENDPOINT, {
    credentials: "include",
    method: "DELETE",
    headers,
    body: JSON.stringify(data),
  });

  const json = await response.json();
  if (response.ok) {
    console.log({ response, json });
    return todos.filter((todo) => todo.name !== deleteTodoName);
  } else {
    console.error({ response, json });
  }
};

// export const downloadTodo = async (downloadTodoName, todos) => {
//   const data = {
//     podName: config.todoAppNamespace,
//     filePath: `${config.todoItemsDirectory}/${downloadTodoName}`,
//   };

//   const FAIROS_HOST = apiHost();
//   const ENDPOINT = "/v1/file/download";

//   const response = await fetch(FAIROS_HOST + ENDPOINT, {
//     credentials: "include",
//     method: "GET",
//     headers,
//     body: JSON.stringify(data),
//   });

//   const json = await response.json();
//   if (response.ok) {
//     console.log({ response, json });
//     return true;
//   } else {
//     console.error({ response, json });
//   }
// };

export const downloadTodo = async (downloadTodoName, todos, userName) => {
  const data = {
    podName: userName,
    filePath: `${"/" + userName}/${downloadTodoName}`,
  };

  const FAIROS_HOST = apiHost();
  const ENDPOINT = "/v1/file/download";

  const url = new URL(FAIROS_HOST + ENDPOINT);
  url.search = new URLSearchParams(data).toString();

  try {
    const response = await fetch(url, {
      credentials: "include",
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      console.error("Failed to download file.");
      return false;
    }

    const blob = await response.blob();

    // Create a download link for the Blob
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = downloadTodoName; // Set the filename for the download
    downloadLink.click();

    return true; // Indicates the download was successful.
  } catch (error) {
    console.error("Error downloading file:", error);
    return false; // Indicates the download failed.
  }
};
