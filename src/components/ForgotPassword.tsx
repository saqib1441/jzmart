"use client";
import { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { useSendOtpMutation } from "@/store/slices/ApiSlice";
import { setTempData } from "@/store/slices/AuthSlice";
import { AppDispatch } from "@/store/store";
import { ErrorDTO } from "@/types/types";

import toast from "react-hot-toast";
import Loader from "@/components/Loader";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const ForgotPassword: FC = () => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      return toast.error("Email is required.");
    }

    try {
      const response = await sendOtp({
        email,
        purpose: "FORGOT_PASSWORD",
      }).unwrap();
      dispatch(setTempData({ email, purpose: "FORGOT_PASSWORD" }));
      toast.success(response.message);
      setEmail("");
      router.push("/reset-password");
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
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="underline text-blue-600 hover:text-blue-800 hover:bg-transparent"
          type="button"
        >
          Forgot password?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Forgot Password</DialogTitle>
          <DialogDescription>
            Please enter your email below to receive a reset OTP.
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4">
          {isLoading && <Loader />}

          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              disabled={isLoading || !email}
              className="w-full"
              onClick={handleResetPassword}
            >
              Send OTP
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPassword;
