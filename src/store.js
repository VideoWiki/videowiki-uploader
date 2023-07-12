import { writable } from "svelte/store";

export let wallet = writable(undefined);
export let savedMnemonic = writable(false);
export let todoItems = writable([]);
export let newTodo = writable("");
export let user = writable("");
export let message = writable("");

export const STATE = {
  UNDEFINED: 0,
  REGISTERING: 1,
  ERROR: 2,
  INFO: 3,
};

export let state = writable(STATE.UNDEFINED);
export const Todo = {
  id: 0,
  text: "",
  done: false,
  createdAt: 0,
};

export const Wallet = {
  address: "",
  mnemonic: "",
};
