"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Link from "next/link";
import { FC } from "react";
import { useUserProfileQuery } from "@/store/slices/ApiSlice";
import { ProfileType } from "@/types/types";
import Loader from "@/components/Loader";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import UpdateProfile from "@/components/UpdateProfile";
import ChangePassword from "@/components/ChangePassword";
import DeleteProfile from "@/components/DeleteProfile";

const ProfilePage: FC = () => {
  const { isLoading, data } = useUserProfileQuery({});
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const router = useRouter();

  const [userData, setUserData] = useState<ProfileType>({
    name: "",
    email: "",
    phone: "",
    city: "",
    address: "",
    interest: "",
    createdAt: new Date(),
  });

  const [socialLinks] = useState([
    { name: "Facebook", link: "https://www.facebook.com/" },
    { name: "Twitter", link: "https://www.twitter.com/" },
    { name: "Instagram", link: "https://www.instagram.com/" },
    { name: "LinkedIn", link: "https://www.linkedin.com/" },
    { name: "Whatsapp", link: "https://wa.me/+9230012345678" },
    { name: "Youtube", link: "https://www.youtube.com/JKHasjhx23" },
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }

    if (data?.data) {
      const user = data.data;
      setUserData({
        name: user.name || "Not set",
        email: user.email || "Not set",
        phone: user.phone || "Not set",
        city: user.city || "Not set",
        address: user.address || "Not set",
        interest: Array.isArray(user.interest)
          ? user.interest.join(", ")
          : user.interest || "Not set",
        createdAt: new Date(user.createdAt),
      });
    }
  }, [data, isLoggedIn, router]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <main className="w-4xl mx-auto py-20">
      {isLoading && <Loader />}
      <Card className="bg-primary pb-0">
        <CardHeader>
          <div className="flex gap-5 items-center">
            <Avatar className="size-32 border-4">
              <AvatarImage src="/profile.jpg" />
              <AvatarFallback>
                <span className="text-5xl font-bold font-inter">SA</span>
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold font-inter">{userData.name}</h2>
              <p>Email: {userData.email}</p>
              <p>Location: {userData.city}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white py-5 space-y-4">
          <div className="space-y-4">
            <h2 className="font-inter text-2xl font-bold border-b-2 w-fit border-primary">
              Personal Information
            </h2>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-semibold">Full Name</TableCell>
                  <TableCell>{userData.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Email</TableCell>
                  <TableCell>{userData.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Phone</TableCell>
                  <TableCell>{userData.phone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">City</TableCell>
                  <TableCell>{userData.city}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Address</TableCell>
                  <TableCell>{userData.address}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Interest</TableCell>
                  <TableCell>{userData.interest}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-semibold">Member Since</TableCell>
                  <TableCell>{formatDate(userData.createdAt)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="space-x-4">
            <UpdateProfile />
            <ChangePassword />
            <DeleteProfile />
          </div>

          <div className="space-y-4">
            <h2 className="font-inter text-2xl font-bold border-b-2 w-fit border-primary">
              Social Media Links
            </h2>
            <div className="space-x-4 flex flex-wrap gap-2">
              {socialLinks.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="secondary">{item.name}</Button>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default ProfilePage;
