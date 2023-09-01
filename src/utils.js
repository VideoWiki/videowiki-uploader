const { Alchemy, Network, Wallet, Utils } = require("alchemy-sdk");
// const dotenv = require("dotenv");

// dotenv.config();
const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
};

// const { API_KEY, PRIVATE_KEY } = process.env;
const API_KEY = "8OvbHJsV8ry1tnkNki_RfQ9836-5zhKn";
const PRIVATE_KEY =
  "6179993d608b4a4a5acfa019e1624b3a0a12337884865c3c633d2d682b134faf";
const settings = {
  apiKey: API_KEY,
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(settings);

let fundWallet = new Wallet(PRIVATE_KEY);

export const apiHost = () => {
  // let url = window.location.href.replace(/^https:\/\/fairos\.video\.wiki\/.*$/, "http://localhost:3000/api");
  let url = "https://dev.cast.video.wiki";
  return url;
};

export const registerAccount = async (username, password, mnemonic) => {
  const ENDPOINT = "/v2/user/signup";
  const FAIROS_HOST = "https://dev.cast.video.wiki";
  console.log(FAIROS_HOST, "kkkk");
  let url = `${FAIROS_HOST}${ENDPOINT}`;
  console.log(url, "urlssss");
  let data = {
    userName: username,
    password,
  };
  if (mnemonic) data.mnemonic = mnemonic;
  console.log(data);
  // return new Promise(async (res, rej) => {
  let response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  let json = await response.json();
  console.log("Address of new account", json.address);
  if (!mnemonic && response.status === 402) {
    await topUpAddress(json.address); //TODO
  }
  console.log(response.status, "status");
  if (response.status === 402) {
    return { status: 402, mnemonic: json.mnemonic };
  } else {
    return { status: response.status, address: json.address, ...json };
  }
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
  console.log(headers);
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
    console.log({ response, json });
  } else {
    if (json.message === "jwt: invalid token") throw json;
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
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };

  let data = {
    podName: userName,
    dirPath: "/" + userName,
  };
  console.log(data, "data");
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
      let res = await Promise.all(
        (json.files || []).map(async ({ name }) => {
          return await readTodo(name, userName);
        })
      );

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
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
  };

  let data = {
    podName: userName,
    filePath: "/" + userName + "/" + todofile,
  };
  console.warn(data, "here33333");
  let FAIROS_HOST = apiHost();
  let ENDPOINT = "/v1/file/download";

  let response = await fetch(
    FAIROS_HOST + ENDPOINT + "?" + new URLSearchParams(data),
    {
      method: "GET",
      headers,
    }
  );
  let json = await response.blob();
  console.warn("here3333344444");
  if (response.ok) {
    console.log({ response, json });
    console.warn("here triggered", response, json);
    let jsonResponse = {
      name: todofile,
      blob: json,
    };
    return jsonResponse;
  } else {
    console.error({ response, json });
  }
};

export async function topUpAddress(address) {
  const nonce = await alchemy.core.getTransactionCount(
    fundWallet.address,
    "latest"
  );
  console.log("Nonce", nonce);
  let transaction = {
    to: address,
    value: Utils.parseEther("0.05"),
    gasLimit: "210000",
    maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
    maxFeePerGas: Utils.parseUnits("20", "gwei"),
    nonce: nonce,
    type: 2,
    chainId: 11155111,
  };
  let rawTransaction = await fundWallet.signTransaction(transaction);
  let tx = await alchemy.core.sendTransaction(rawTransaction);
  console.log("Sent transaction", tx);
}

export const loginAccount = async (userName, password) => {
  const ENDPOINT = "/v2/user/login";
  const FAIROS_HOST = "https://dev.cast.video.wiki";
  let data = {
    userName,
    password,
  };
  console.log("ppppp", userName, password);
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  console.log("llllll", response);
  let json = await response.json();
  console.log("jjkkkk", json);
  headers.Authorization = `Bearer ${json.accessToken}`;
  if (response.ok) {
    localStorage.setItem("accessToken", json.accessToken);
    try {
      return {
        userName: userName,
        address: json.address,
      };
    } catch (error) {
      console.error("Error initializing todos", error);
    }
  } else {
    console.error({ response, json });
    const error = {
      status: response.status,
      message: json.message,
    };
    throw error;
  }

  // If something goes wrong or the response is not ok, return null
  return null;
};

export const addTodo = async (todos, userName, file) => {
  console.log("aaaaaaaaa");
  console.log(file.type);

  const blob = new Blob([file], {
    type: file.type,
  });

  const formData = new FormData();
  formData.append("files", file);
  formData.set("podName", userName);
  formData.set("dirPath", "/" + userName);
  formData.set("blockSize", "1Mb");

  const ENDPOINT = "/v1/file/upload";
  let response = await fetch(apiHost() + ENDPOINT, {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });
  let json = await response.json();
  if (response.ok) {
    let jsonResponse = {
      name: file.name,
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

export const getUsername = async (str) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: `{"username":"${str}"}`,
  };
  try {
    var username = await fetch(
      "https://api.video.wiki/api/swarm/generate/username/",
      options
    );
    let json = await username.json();
    if (username.ok) {
      return { ...json, login: false };
    } else {
      if (json.error === "Username already exists.") {
        username = await fetch(
          "https://api.video.wiki/api/swarm/get/username/?username=" + str
        );
        json = await username.json();
        if (username.ok) {
          return { ...json, login: true };
        }
      }
    }
  } catch (e) {
    console.log(e);
  }
};

// uploadToCloud({ commit }, { file, connectSTr, container }) {
//   const data = new FormData();
//   data.append('file', file);
//   data.append('azure_container', container);
//   data.append('azure_connect_str', connectSTr);

//   const config = {
//     method: 'post',
//     maxBodyLength: Infinity,
//     url: 'https://api.storage.video.wiki/api/upload/',
//     headers: {
//       Authorization: constants.StorageKey,
//     },
//     data: data,
//   };
//   return new Promise((resolve, reject) => {
//     axios(config)
//       .then((response) => {
//         resolve(response.data);
//       })
//       .catch((e) => {
//         reject(e);
//       });
//   });
// },
// checkStatus({ commit }, payload) {
//   const config = {
//     method: 'get',
//     url:
//       'https://api.storage.video.wiki/api/upload/status/?task_id=' + payload,
//     headers: {
//       Authorization: constants.StorageKey,
//     },
//   };
//   return new Promise((resolve, reject) => {
//     axios(config)
//       .then(({ data }) => {
//         resolve(data);
//       })
//       .catch((e) => {
//         console.log(e, 'dsd');
//         reject(e);
//       });
//   });
// },
