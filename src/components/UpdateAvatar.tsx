"use client";

import { FC, FormEvent, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { FaCloudArrowUp } from "react-icons/fa6";
import {
  useUpdateAvatarMutation,
  useUserProfileQuery,
} from "@/store/slices/ApiSlice";
import Image from "next/image";
import toast from "react-hot-toast";
import Loader from "./Loader";

const UpdateAvatar: FC = () => {
  const { data, refetch } = useUserProfileQuery({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<File | null>(null);
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
  const [open, setOpen] = useState(false);

  // Handle image selection and preview
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setAvatarPreview(imageUrl);
      setAvatar(file);
    }
  };

  // Form submission handler
  const formHandler = async (e: FormEvent) => {
    e.preventDefault();

    if (!avatar) {
      console.error("No avatar file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("avatar", avatar);

    try {
      const response = await updateAvatar(formData).unwrap();
      toast.success(response.message);
      setOpen(false);
      return refetch();
    } catch (error) {}
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Loader */}
      {isLoading && <Loader />}
      <DialogTrigger asChild>
        <Button variant="outline">Update Avatar</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Avatar</DialogTitle>
          <DialogDescription>
            Personalize your profile by uploading a new avatar.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-5" onSubmit={formHandler}>
          <div className="flex items-center gap-5">
            <Avatar className="size-32 border-4 cursor-pointer">
              {avatarPreview ? (
                <AvatarImage src={avatarPreview} alt="Avatar Preview" />
              ) : (
                <AvatarImage
                  src={data?.data?.avatar || "/profile.jpg"}
                  alt="Current Avatar"
                />
              )}
              <AvatarFallback>
                <Image
                  src="/profile.jpg"
                  alt="fallback avatar"
                  className="w-full h-full"
                  width={32}
                  height={32}
                  priority
                />
              </AvatarFallback>
            </Avatar>
            <div className="w-full">
              <Label
                className="cursor-pointer border-2 border-dashed py-5 justify-center"
                htmlFor="avatar"
              >
                <FaCloudArrowUp size={40} />
                <span>Upload Avatar</span>
              </Label>
              <Input
                type="file"
                id="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>
          <Button type="submit">Update Avatar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateAvatar;
