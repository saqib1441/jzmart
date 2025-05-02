import { isAuthorized } from "@/utils/authorization";
import { redirect } from "next/navigation";
import { FC, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const PublicRoutes: FC<Props> = async ({ children }) => {
  const isLoggedIn = await isAuthorized();

  if (isLoggedIn) {
    redirect("/");
  }
  return <>{children}</>;
};

export default PublicRoutes;
