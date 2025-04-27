"use client";
import { FC, FormEvent, useEffect, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/store/slices/ApiSlice";
import Loader from "./Loader";
import { ErrorDTO } from "@/types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setIsLoggedIn } from "@/store/slices/AuthSlice";
import ForgotPassword from "./ForgotPassword";

const LoginForm: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginUser, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/");
    }
  }, [isLoggedIn, router]);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return toast.error("All fields are required.");
    }

    try {
      const response = await loginUser({ email, password }).unwrap();

      setEmail("");
      setPassword("");
      dispatch(setIsLoggedIn(true));
      toast.success(response.message);
      return router.push("/");
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  return (
    <form className="space-y-4 text-center" onSubmit={handleLogin}>
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

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <Checkbox id="remember-me" />
          <Label
            htmlFor="remember-me"
            className="font-normal cursor-pointer select-none"
          >
            Remember me
          </Label>
        </div>
        <ForgotPassword />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !email || !password}
      >
        Login
      </Button>
    </form>
  );
};

export default LoginForm;
