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
  useSendOtpMutation,
  useSignupUserMutation,
} from "@/store/slices/ApiSlice";
import { ErrorDTO } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  setIsLoggedIn,
  setTempData,
  TempDataType,
} from "@/store/slices/AuthSlice";
import Loader from "@/components/Loader";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const VerificationPage: FC = () => {
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [signupUser, { isLoading: isCreating }] = useSignupUserMutation();
  const [resendOtp, { isLoading: isResending }] = useSendOtpMutation();
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

    try {
      const response = await signupUser({ ...tempData, otp }).unwrap();
      dispatch(setTempData({}));
      dispatch(setIsLoggedIn(true));
      setOtp("");
      toast.success(response.message);
      return router.push("/");
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
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900 px-4">
      {/* Loader */}
      {(isCreating || isResending) && <Loader />}

      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Verify Your Email
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-300">
            Thank you for creating your account on JZ Mart. We&#39;ve sent a
            6-digit code to your email {maskEmail()}. Enter it below to
            continue.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="otp" className="text-muted-foreground">
              Your Verification Code
            </Label>
            <Input
              maxLength={6}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              id="otp"
              type="text"
              placeholder="6-digit code"
            />
          </div>

          <Button
            onClick={handleSubmit}
            className="w-full"
            disabled={!otp || otp.length < 6 || isCreating || isResending}
          >
            Submit Code
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

export default VerificationPage;
