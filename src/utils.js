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
  let url = process.env.REACT_APP_API_URL;
  // let url = "https://dev.cast.video.wiki";
  return url;
};

const editorUrl = process.env.REACT_APP_API_EDITOR;
const staorageUrl = process.env.REACT_APP_API_STORAGE;
const apiKey = process.env.REACT_APP_API_KEY;
const apiUrl = process.env.REACT_APP_API_URL;
console.log(`API url: ${apiUrl}`);
console.log(`API Editor: ${editorUrl}`);
console.log(`API storage: ${staorageUrl}`);
console.log(`API Key: ${apiKey}`);

export const registerAccount = async (username, password, mnemonic) => {
  const ENDPOINT = "/v2/user/signup";
  const FAIROS_HOST = apiHost();
  let url = `${FAIROS_HOST}${ENDPOINT}`;
  let data = {
    userName: username,
    password,
  };
  if (mnemonic) data.mnemonic = mnemonic;
  // return new Promise(async (res, rej) => {
  let response = await fetch(url, {
    headers,
    method: "POST",
    body: JSON.stringify(data),
  });
  let json = await response.json();
  if (!mnemonic && response.status === 402) {
    await topUpAddress(json.address); //TODO
  }
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
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });

  let json = await response.json();
  if (response.ok) {
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
      let res = await Promise.all(
        (json.files || []).map(async ({ name }) => {
          return await readTodo(name, userName);
        })
      );

      return res;
    } else {
      if (json.message === "jwt: invalid token") {
        return { message: "expired" };
      }
      console.error({ response, json });
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

export const onlyListTodos = async (userName) => {
  let headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
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
      return json;
    } else {
      if (json.message === "jwt: invalid token") {
        return { message: "expired" };
      }
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
  if (response.ok) {
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
  const FAIROS_HOST = apiHost();
  let data = {
    userName,
    password,
  };
  let response = await fetch(FAIROS_HOST + ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  let json = await response.json();
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
      editorUrl + "/api/swarm/generate/username/",
      options
    );
    let json = await username.json();
    if (username.ok) {
      return { ...json, login: false };
    } else {
      if (json.error === "Username already exists.") {
        username = await fetch(
          editorUrl + "/api/swarm/get/username/?username=" + str
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
//     url: staorageUrl+'/api/upload/',
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
//       staorageUrl+'/api/upload/status/?task_id=' + payload,
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

export const getCookie = async (username, password) => {
  const body = {
    username: username,
    password: password,
  };
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const response = await fetch(
      editorUrl + "/api/swarm/login?" + new URLSearchParams(body),
      options
    );
    const json = await response.json();
    if (response.ok) {
      if (json.result.slice(0, 7) === " fairOS") {
        localStorage.setItem("fairOs", json.result.trim());
      } else {
        setTimeout(() => getCookie(username, password), 2000);
      }
    } else {
    }
  } catch (e) {
    console.log(e);
  }
};
export const urlUpload = async (username, file) => {
  var formData = new FormData();
  formData.append("username", username);
  formData.append("cookie", localStorage.getItem("fairOs").trim());
  formData.append("video_url", file);

  var requestOptions = {
    method: "POST",
    body: formData,
    redirect: "follow",
  };

  const upload = await fetch(
    staorageUrl + "/api/swarm/upload/",
    requestOptions
  );

  const json = await upload.json();
  console.log(json, "upload");
  return json;
};

export const uploadStatus = async (taskId) => {
  try {
    const status = await fetch(
      staorageUrl + "/api/swarm/upload/status/" + taskId
    );
    const json = await status.json();
    return json;
  } catch (e) {
    throw e;
  }
};

export const checkLogin = async () => {
  const options = {
    method: "GET",
    headers,
  };
  const res = await fetch(apiHost() + "/v1/pod/ls", options);
  console.log(res.status);
  return res.status === 200;
};
