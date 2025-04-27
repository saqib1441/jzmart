"use client";
import { FC, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  useResetPasswordMutation,
  useSendOtpMutation,
} from "@/store/slices/ApiSlice";
import { ErrorDTO } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setTempData, TempDataType } from "@/store/slices/AuthSlice";
import Loader from "@/components/Loader";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const ResetPasswordPage: FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [resendOtp, { isLoading: isResending }] = useSendOtpMutation();
  const [resetPassword, { isLoading: isReseting }] = useResetPasswordMutation();
  const { tempData, isLoggedIn } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  // Handle OTP submission
  const handleSubmit = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Please enter a valid 6-digit OTP.");
    }

    if (!password || password.length < 6) {
      return toast.error("Please enter a valid password.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const response = await resetPassword({
        ...tempData,
        password,
        otp,
      }).unwrap();
      dispatch(setTempData({}));
      setPassword("");
      setConfirmPassword("");
      setOtp("");
      toast.success(response.message);
      return router.push("/login");
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  const resendOtpHandler = async () => {
    try {
      const { email, purpose } = tempData as TempDataType;

      const response = await resendOtp({
        email,
        purpose,
      }).unwrap();
      return toast.success(response.message);
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  function maskEmail() {
    if (!tempData?.email) return "";
    const [localPart, domain] = tempData.email.split("@");
    const maskedLocalPart = localPart.slice(0, 2) + "****";
    return maskedLocalPart + "@" + domain;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
      {/* Loader */}
      {(isResending || isReseting) && <Loader />}

      <Card className="w-full max-w-lg shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Please check your email, we&#39;ve sent a 6-digit code to your email{" "}
            {maskEmail()}.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-1 text-left">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1 text-left">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="otp">Your Verification Code</Label>
              <Input
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                id="otp"
                type="text"
                placeholder="6-digit code"
              />
            </div>
          </form>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={
              !otp ||
              otp.length < 6 ||
              isResending ||
              isReseting ||
              !password ||
              password.length < 6 ||
              !confirmPassword
            }
          >
            Reset Password
          </Button>

          <Button
            variant="ghost"
            className="w-full"
            onClick={resendOtpHandler}
            disabled={isResending}
          >
            Resend Email
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPasswordPage;
