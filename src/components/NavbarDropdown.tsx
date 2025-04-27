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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { setIsLoggedIn } from "@/store/slices/AuthSlice";
import Loader from "./Loader";
import {
  useLogoutUserMutation,
  useUserProfileQuery,
} from "@/store/slices/ApiSlice";

const NavbarDropdown = () => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const [logoutUser, { isLoading }] = useLogoutUserMutation();
  const { data, isLoading: isFetching } = useUserProfileQuery(
    {},
    { skip: !isLoggedIn }
  );

  const navigate = (url: string) => router.push(url);

  const logoutHander = async () => {
    try {
      const response = await logoutUser({}).unwrap();
      dispatch(setIsLoggedIn(false));
      return toast.success(response.message);
    } catch (error: unknown) {
      const err = error as ErrorDTO;
      const errMessage =
        error instanceof Error ? error.message : "Something went wrong";
      return toast.error(err.data.message || errMessage);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase())
      .join("");
  };

  const avatarRouter = () => {
    if (isLoggedIn) {
      router.push("/profile");
    }
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
                <AvatarImage src="/profil.jpg" />
                <AvatarFallback>
                  <div className="text-2xl">
                    {isLoggedIn && data?.data ? (
                      getInitials(data.data.name)
                    ) : (
                      <FaRegUser />
                    )}
                  </div>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex items-center justify-center mt-2 text-base ">
              {isLoggedIn && data?.data ? (
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
        {isLoggedIn && data?.data ? (
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
