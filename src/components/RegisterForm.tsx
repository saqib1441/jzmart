"use client";
import { FC, FormEvent, useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import { ErrorDTO } from "@/types/types";
import { useSendOtpMutation } from "@/store/slices/ApiSlice";
import Loader from "./Loader";
import { setTempData } from "@/store/slices/AuthSlice";

const RegisterForm: FC = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [sendOtp, { isLoading }] = useSendOtpMutation();

  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const formHandler = async (e: FormEvent) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formValues;

    // Basic validations
    if (!name || !email || !password || !confirmPassword) {
      return toast.error("All fields are required!");
    }

    if (name.trim().length <= 3) {
      return toast.error("Please enter a valid name.");
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      return toast.error("Please enter a valid email address.");
    }

    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    try {
      const response = await sendOtp({ email, purpose: "REGISTER" }).unwrap();
      dispatch(setTempData({ name, email, password, purpose: "REGISTER" }));
      setFormValues({
        confirmPassword: "",
        email: "",
        name: "",
        password: "",
      });
      toast.success(response.message);
      return router.push("/verification");
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  return (
    <form className="space-y-4 text-center" onSubmit={formHandler}>
      {/* Loader */}
      {isLoading && <Loader />}

      {/* Name */}
      <div className="space-y-1">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          placeholder="Enter your full name"
          value={formValues.name}
          onChange={handleInputChange}
        />
      </div>

      {/* Email */}
      <div className="space-y-1">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter your email"
          value={formValues.email}
          onChange={handleInputChange}
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={formValues.password}
          onChange={handleInputChange}
        />
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Re-enter your password"
          value={formValues.confirmPassword}
          onChange={handleInputChange}
        />
      </div>

      <Button
        type="submit"
        disabled={
          isLoading ||
          !formValues.email ||
          !formValues.password ||
          !formValues.name
        }
      >
        Create Account
      </Button>
    </form>
  );
};

export default RegisterForm;
