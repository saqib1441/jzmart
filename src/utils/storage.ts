// utils/storage.ts
import localforage from "localforage";

localforage.config({
  name: "myApp",
  storeName: "myAppStore",
});

export default localforage;
