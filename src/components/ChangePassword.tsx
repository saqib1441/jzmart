"use client";
import { FC, FormEvent, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import "react-phone-number-input/style.css";
import { ErrorDTO } from "@/types/types";
import toast from "react-hot-toast";
import Loader from "./Loader";
import {
  useChangePasswordMutation,
  useUserProfileQuery,
} from "@/store/slices/ApiSlice";

const ChangePassword: FC = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const { data } = useUserProfileQuery({});
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const formHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      return toast.error("Please fill all fields!");
    }

    if (newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters long!");
    }

    if (newPassword !== confirmPassword) {
      return toast.error("New Password do not match!");
    }

    try {
      const response = await changePassword({
        oldPassword,
        newPassword,
        id: data.data.id,
      }).unwrap();
      toast.success(response.message);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      return setOpen(false);
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
        <Button variant="outline">Change Password</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Secure your account by updating your password. Make sure to choose a
            strong and unique password you haven&#39;t used before
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={formHandler}>
          <div className="space-y-1">
            <Label htmlFor="old-password">Old Password</Label>
            <Input
              id="old-password"
              type="text"
              placeholder="Enter your old password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              placeholder="Enter your new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Enter your confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Change Password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePassword;
