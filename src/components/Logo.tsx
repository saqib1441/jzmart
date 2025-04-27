import Image from "next/image";
import { FC } from "react";
import LogoImage from "@/assets/logo.png";
import Link from "next/link";

const Logo: FC = () => {
  return (
    <Link href="/">
      <Image src={LogoImage} alt="jz-mart-logo" priority />
    </Link>
  );
};

export default Logo;
