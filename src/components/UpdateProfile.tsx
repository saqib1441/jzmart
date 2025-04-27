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
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import {
  useUpdateProfileMutation,
  useUserProfileQuery,
} from "@/store/slices/ApiSlice";
import { ErrorDTO } from "@/types/types";
import toast from "react-hot-toast";
import Loader from "./Loader";

const UpdateProfile: FC = () => {
  const { data, refetch } = useUserProfileQuery({});

  const [name, setName] = useState<string | undefined>(data.data.name || "");
  const [address, setAddress] = useState<string | undefined>(
    data.data.address || ""
  );
  const [city, setCity] = useState<string | undefined>(data.data.city || "");
  const [interest, setInterest] = useState<string | undefined>(
    data.data.interest || ""
  );
  const [phone, setPhone] = useState<string | undefined>(data.data.phone || "");
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const [open, setOpen] = useState<boolean>(false);

  const formHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !address || !city || !interest || !phone) {
      return toast.error("All fields are required!");
    }

    if (!isValidPhoneNumber) {
      return toast.error("Please enter a valid phone number");
    }

    try {
      const response = await updateProfile({
        name,
        phone,
        address,
        city,
        interest,
      }).unwrap();
      toast.success(response.message);
      refetch();
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
        <Button>Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your personal details to keep your profile current and
            accurate.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" onSubmit={formHandler}>
          <div className="space-y-1">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="phone">Phone</Label>
            <div className="rounded-md border border-input bg-background px-3 py-2 focus-within:ring-2 focus-within:ring-ring">
              <PhoneInput
                id="phone"
                defaultCountry="PK"
                placeholder="Enter your phone number"
                value={phone}
                onChange={setPhone}
                className="w-full flex items-center gap-1"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              placeholder="Enter your city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              type="text"
              placeholder="Enter your address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="interest">Interest</Label>
            <Input
              id="interest"
              type="text"
              placeholder="Enter your interest"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            Update Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
