/* eslint-disable react/no-unescaped-entities */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useLocale } from "next-intl";
interface SignInFormData {
  email: string;
  password: string;
}

const SignInPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<SignInFormData>({
    email: "",
    password: "",
  });
  const locale = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/auth/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();
      if (!response.ok) {
        // Only show toast, don't let 401 throw uncaught errors
        const message = data?.message?.toLowerCase() || "";

        if (message.includes("invalid")) {
          toast.error("Incorrect email or password");
        } else {
          toast.error(data.message || "Login failed");
        }

        return;
      }
      toast.success("Login successful!");

      if (response.ok) {
        toast.success("Login successful!");
        const { token, user } = data.data;

        if (token && user) {
          localStorage.setItem("token", token);
          
          // Store user data only (no subscription storage)
          localStorage.setItem("user", JSON.stringify(user));
          toast.success("Welcome! Login successful!");
        } else {
          console.warn("⚠️ Missing token or user in data.data:", data.data);
        }
        router.push(`/${locale}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between sm:flex-col tab:flex-row p-2 items-center w-full tab:h-screen relative">
        <div className="shadow-[0px_4px_24px_rgba(0, 0, 0, 0.05)] bg-white p-[32px] h-full flex-col rounded-2xl tab:w-1/2 sm:w-full flex justify-center items-center">
          <div className="logo tab:ml-5 mr-auto sm:mb-12 tab:mb-[130px]">
            <Image
              src="/images/png/logo (2).png"
              alt="sign in"
              width={100}
              height={100}
              className="w-[170px]  h-full object-contain"
            />
          </div>
          <div className="sm:w-full tab:w-8/12 h-max">
            <h1 className="text-3xl font-semibold text-[#383F34] mb-8 ">
              Join the study circle by signing in
            </h1>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="**************"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <Link
                href={`${process.env.NEXT_PUBLIC_DOMAIN_URL}forget-password`}
                className="forgot-link"
              >
                Forget your password?
              </Link>

              <Button
                type="submit"
                variant="primary"
                className="primary-button"
                disabled={isLoading}
                icon={isLoading ? Loader : undefined}
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <p className="secondary-link">
              Don't have an account? <Link href="/ar/signup">Sign up here</Link>
            </p>

            <p className="footer-text">
              By signing in, you are agreeing to our{" "}
              <a href="#">privacy policy</a> and <a href="#">terms</a>.
            </p>
          </div>
        </div>
        <div className="rounded-2xl tab:w-1/2 sm:w-full h-full ">
          <Image
            src="/images/png/stydy-bg.png"
            alt="sign in"
            width={500}
            height={500}
            className="w-full rounded-2xl h-full object-contain"
          />
        </div>
      </div>
    </>
  );
};

export default SignInPage;
