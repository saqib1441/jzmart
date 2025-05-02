"use client";
import { Provider } from "react-redux";
import { persistor, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import { FC, ReactNode } from "react";

type StoreChildrenType = {
  children: ReactNode;
};

export const StoreProvider: FC<StoreChildrenType> = ({ children }) => {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>{children}</PersistGate>
    </Provider>
  );
};
