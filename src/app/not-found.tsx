"use client";

import NotFoundImage from "@/assets/page-not-found.png";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Home, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const PageNotFound = () => {
  const router = useRouter();
  return (
    <main>
      <div className="container flex flex-col items-center py-20">
        <div>
          <Image src={NotFoundImage} alt="jz-mart-not-found-page" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-inter font-bold">404, Page Not Found</h1>
          <p className="w-xl mx-auto text-muted-foreground mb-4 mt-2">
            Something went wrong. It&#39;s look that your requested could not be
            found. It&#39;s look like the link is broken or the page is removed.
          </p>
          <div className="space-x-2">
            <Button onClick={() => router.back()}>
              <span>
                <ArrowLeft />
              </span>
              GO BACK
            </Button>
            <Button variant="outline" onClick={() => router.push("/")}>
              <span>
                <Home />
              </span>
              <span>GO TO HOME</span>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PageNotFound;
