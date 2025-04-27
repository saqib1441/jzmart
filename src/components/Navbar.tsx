import { FC } from "react";
import Logo from "./Logo";
import NavbarTopImage from "@/assets/navbar-top-image.png";
import Image from "next/image";
import NavbarSearch from "./NavbarSearch";
import Link from "next/link";
import { LuRadar } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa6";
import NavbarDropdown from "./NavbarDropdown";

const Navbar: FC = () => {
  return (
    <nav>
      {/* Navbar Top Image */}
      <div>
        <Image
          src={NavbarTopImage}
          alt="jz-mart-top-image"
          height={70}
          className="w-full"
          priority
        />
      </div>
      <div className="container flex items-end justify-between py-5">
        {/* Logo */}
        <Logo />

        {/* Search */}
        <NavbarSearch />

        {/* Links */}
        <div className="flex items-center gap-5">
          {/* Drop Down Menu */}
          <NavbarDropdown />
          <Link
            href="/fav"
            className="flex flex-col items-center gap-1 hover:text-primary transition-all duration-300"
          >
            <span className="text-xl">
              <FaRegHeart />
            </span>
            <span>Favourites</span>
          </Link>
          <Link
            href="/nearme"
            className="flex flex-col items-center gap-1 hover:text-primary transition-all duration-300"
          >
            <span className="text-xl">
              <LuRadar />
            </span>
            <span>Near Me</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
