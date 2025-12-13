/* eslint-disable react/no-unescaped-entities */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Loader } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast, { Toaster } from "react-hot-toast";
import { useLocale, useTranslations } from "next-intl";
interface SignInFormData {
  email: string;
  password: string;
}

const SignInPage = () => {
  const t = useTranslations("login");
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
        `${process.env.NEXT_PUBLIC_DASHBOARD_URL}/api/auth/login`,
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
    <div className="min-h-screen flex items-center justify-center bg-[#F7F9FC]">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between sm:flex-col tab:flex-row p-2 items-center w-full tab:h-screen relative">
        <div className=" sm:p-0 tab:p-[32px] h-full flex-col gap-8 rounded-2xl tab:w-1/2 sm:w-full flex justify-center items-center">
          <div className="sm:w-full shadow-[0px_4px_24px_rgba(0, 0, 0, 0.05)] bg-white p-[32px] rounded-2xl tab:w-9/12 h-max">
            <h1 className="text-3xl font-semibold text-background mb-8 ">
              {t("title")}
            </h1>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email">{t("emailLabel")}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t("emailPlaceholder")}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">{t("passwordLabel")}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder={t("passwordPlaceholder")}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute ${
                      locale === "ar" ? "left-3" : "right-3"
                    } top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none`}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </button>
                </div>
              </div>

              <Link
                href="https://studycircleapp.com/forgot-password"
                className="forgot-link"
              >
                {t("forgotPassword")}
              </Link>

              <Button
                type="submit"
                variant="primary"
                className="primary-button"
                disabled={isLoading}
                icon={isLoading ? Loader : undefined}
              >
                {isLoading ? t("signingInButton") : t("signInButton")}
              </Button>
            </form>

            <p className="secondary-link">
              {t("noAccountText")}{" "}
              <Link className=" font-semibold" href={`/${locale}/signup`}>
                {t("signUpHere")}
              </Link>
            </p>

            <p className="footer-text">
              {t("footerText")}
              <a href="#">{t("privacyPolicy")}</a> and{" "}
              <a href="#">{t("terms")}</a>.
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
    </div>
  );
};

export default SignInPage;
