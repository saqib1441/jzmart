"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { useDeleteProfileMutation } from "@/store/slices/ApiSlice";
import toast from "react-hot-toast";
import Loader from "./Loader";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { useRouter } from "next/navigation";
import { ErrorDTO } from "@/types/types";

const DeleteProfile = () => {
  const [open, setOpen] = useState(false);
  const [deleteProfile, { isLoading }] = useDeleteProfileMutation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await deleteProfile({}).unwrap();
      toast.success(response.message);
      setOpen(false);
      return router.push("/login");
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Loader */}
      {isLoading && <Loader />}
      <DialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteProfile;
