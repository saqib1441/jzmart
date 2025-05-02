"use client";
import { Button } from "@/components/ui/button";
import localforage from "localforage";
import { FC } from "react";
import toast from "react-hot-toast";

const HomePage: FC = () => {
  const clearStorage = () => {
    localforage
      .clear()
      .then(() => {
        toast.success("Storage cleared successfully");
      })
      .catch((err) => {
        toast.error("Error clearing storage");
      });
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center gap-5">
      <h1 className="font-bold text-3xl">Home Page</h1>
      <Button onClick={clearStorage}>Clear Storage</Button>
    </div>
  );
};

export default HomePage;
