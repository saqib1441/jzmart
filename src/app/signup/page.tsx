import RegisterForm from "@/components/RegisterForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FC } from "react";
import { FaFacebookF } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

const SignupPage: FC = () => {
  return (
    <main className="bg-muted py-20">
      <div className="w-xl bg-background rounded shadow p-10 mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-inter font-bold text-center">
            Welcome to JZ MART
          </h1>
          <p className="text-muted-foreground text-sm text-center">
            Sign up at JZ Mart for exclusive deals and fast shopping!
          </p>
        </div>

        {/* Register Form */}
        <RegisterForm />

        <p className="text-center">
          Already have an account?{" "}
          <Link href="/login" className="text-primary">
            Login
          </Link>
        </p>

        <div className="flex items-center gap-2">
          <hr className="w-full" />
          <p className="text-muted-foreground font-medium">OR</p>
          <hr className="w-full" />
        </div>

        <div className="flex items-center gap-2 justify-center">
          <Button variant="outline">
            <span>
              <FcGoogle />
            </span>
            <span>Signup with google</span>
          </Button>
          <Button variant="outline">
            <span>
              <FaFacebookF color="blue" />
            </span>
            <span>Signup with facebook</span>
          </Button>
        </div>

        <p className="bg-muted px-3 py-2 rounded">
          By processing you agree our term and conditions, Privacy Policy, and
          consent to receive emails about the plateform productsand services. If
          you do not agree, please do not proceed.
        </p>
      </div>
    </main>
  );
};

export default SignupPage;
