import { isAuthorized } from "@/utils/authorization";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const ProtectedRoutes: FC<Props> = async ({ children }) => {
  const isLoggedIn = await isAuthorized();

  if (!isLoggedIn) {
    redirect("/login");
  }
  return <>{children}</>;
};

export default ProtectedRoutes;
