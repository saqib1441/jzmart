"use client";

import { FC, useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

const NavbarSearch: FC = () => {
  const [value, setValue] = useState("products");
  return (
    <form>
      <div className="flex items-center gap-3 w-fit mx-auto mb-2">
        <p className="text-muted-foreground">Search for: </p>
        <div className="flex items-center gap-2 border rounded p-1">
          <Button
            type="button"
            variant={value === "products" ? "default" : "ghost"}
            onClick={() => setValue("products")}
            className="text-sm px-2 h-7"
          >
            Products
          </Button>
          <Button
            type="button"
            variant={value === "supplier" ? "default" : "ghost"}
            onClick={() => setValue("supplier")}
            className="text-sm px-2 h-7"
          >
            Supplier
          </Button>
          <Button
            type="button"
            variant={value === "buyer" ? "default" : "ghost"}
            onClick={() => setValue("buyer")}
            className="text-sm px-2 h-7"
          >
            Buyer
          </Button>
        </div>
      </div>

      <div className="flex items-center border p-1 rounded w-[550px]">
        <Input
          type="text"
          placeholder="I am looking for..."
          className="border-none shadow-none w-full"
        />
        <Button>Search</Button>
      </div>
    </form>
  );
};

export default NavbarSearch;
