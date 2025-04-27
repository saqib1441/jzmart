"use client";
import { FC, FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ErrorDTO } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import Loader from "@/components/Loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSendOtpMutation } from "@/store/slices/ApiSlice";
import { setTempData } from "@/store/slices/AuthSlice";

const ResetPasswordPage: FC = () => {
  const [email, setEmail] = useState("");
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleResetPassword = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      return toast.error("Email is required.");
    }

    try {
      const response = await sendOtp({
        email,
        purpose: "FORGOT_PASSWORD",
      }).unwrap();
      dispatch(setTempData({ email, purpose: "FORGOT_PASSWORD" }));
      setEmail("");
      toast.success(response.message);
      return router.push("/reset-password");
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  return (
    <main className="bg-muted py-20">
      <div className="w-xl bg-background rounded shadow p-10 mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-inter font-bold text-center">
            Forgot Password
          </h1>
          <p className="text-muted-foreground text-center">
            Please enter your email below to reset your password
          </p>
        </div>

        <form className="space-y-4 text-center" onSubmit={handleResetPassword}>
          {/* Loading */}
          {isLoading && <Loader />}

          <div className="space-y-1 text-left">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !email}
          >
            Forgot Password
          </Button>
        </form>
      </div>
    </main>
  );
};

export default ResetPasswordPage;
