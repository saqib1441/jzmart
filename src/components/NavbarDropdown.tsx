"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { FaEnvelopeOpenText, FaRegHeart, FaRegUser } from "react-icons/fa6";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BiMessageSquareDetail } from "react-icons/bi";
import { TbLogout2, TbMessage2Star, TbWorldSearch } from "react-icons/tb";
import { useRouter } from "next/navigation";
import { ErrorDTO } from "@/types/types";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store/store";
import Loader from "./Loader";
import {
  useLogoutUserMutation,
  useUserProfileQuery,
} from "@/store/slices/ApiSlice";
import Image from "next/image";

const NavbarDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { data, isLoading: isFetching } = useUserProfileQuery({});

  const navigate = (url: string) => router.push(url);

  const logoutHander = async () => {
    try {
      const response = await logoutUser({}).unwrap();
      return toast.success(response.message);
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  const avatarRouter = () => {
    router.push("/profile");
  };

  if (isFetching) {
    return <Loader />;
  }

  return (
    <DropdownMenu>
      {isLoading && <Loader />}
      <DropdownMenuTrigger asChild>
        <div className="flex flex-col items-center gap-1 select-none cursor-pointer hover:text-primary transition-all duration-300">
          <span className="text-xl">
            <FaRegUser />
          </span>
          <span>My Account</span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem className="focus:bg-transparent">
          <div className="w-full">
            <div className="w-fit mx-auto" onClick={avatarRouter}>
              <Avatar className="size-14 cursor-pointer">
                <AvatarImage src={data?.data?.avatar} />
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
            </div>
            <div className="flex items-center justify-center mt-2 text-base ">
              {data?.data ? (
                <span>{data.data.name}</span>
              ) : (
                <>
                  <button
                    className="px-4 border-r hover:text-primary transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("login")}
                  >
                    Login
                  </button>
                  <button
                    className="px-4 hover:text-primary transition-all duration-300 cursor-pointer"
                    onClick={() => navigate("signup")}
                  >
                    Signup
                  </button>
                </>
              )}
            </div>
          </div>
        </DropdownMenuItem>
        {data?.data ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("profile")}>
              <button className="select-none cursor-pointer flex items-center gap-2 text-base w-full">
                <FaRegUser />
                <span>Profile</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="select-none cursor-pointer flex items-center gap-2 text-base w-full"
                onClick={() => navigate("messages")}
              >
                <BiMessageSquareDetail />
                <span>Messages</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="select-none cursor-pointer flex items-center gap-2 text-base w-full"
                onClick={() => navigate("favourites")}
              >
                <FaRegHeart />
                <span>Favourites</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="select-none cursor-pointer flex items-center gap-2 text-base w-full"
                onClick={() => navigate("reviews")}
              >
                <TbMessage2Star />
                <span>My Reviews</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="select-none cursor-pointer flex items-center gap-2 text-base w-full"
                onClick={() => navigate("rfq")}
              >
                <FaEnvelopeOpenText />
                <span>My RFQ</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="select-none cursor-pointer flex items-center gap-2 text-base w-full"
                onClick={() => navigate("history")}
              >
                <TbWorldSearch />
                <span>Browser History</span>
              </button>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <button
                className="select-none cursor-pointer flex items-center gap-2 text-base w-full"
                onClick={logoutHander}
              >
                <TbLogout2 />
                <span>Logout</span>
              </button>
            </DropdownMenuItem>
          </>
        ) : (
          ""
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NavbarDropdown;
