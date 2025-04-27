"use client";

import { Button } from "@/components/ui/button";
import localforage from "@/utils/storage";
import { FC } from "react";
import toast from "react-hot-toast";

const HomePage: FC = () => {
  const storageHandler = () => {
    localforage
      .clear()
      .then(() => {
        window.location.reload();
        return toast.success("Storage cleared successfully");
      })
      .catch((err) => {
        // This code runs if there were any errors
        console.error(err);
      });
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5">
      <h1 className="font-bold text-3xl">Home Page</h1>
      <Button onClick={storageHandler}>Clear Localforage Data</Button>
      <Button>Login With Google</Button>
    </div>
  );
};

export default HomePage;
