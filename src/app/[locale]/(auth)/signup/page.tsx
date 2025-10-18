/* eslint-disable react/no-unescaped-entities */
"use client";
import React, { useEffect, useState } from "react";
import AuthLayout from "@/components/shared/AuthLayout";
import { Button } from "@/components/ui/Button";
import { Loader, User, GraduationCap, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCities, getLevels, getSchools } from "@/services/locationService";
import toast, { Toaster } from "react-hot-toast";
import { useLocale } from "next-intl";
import Image from "next/image";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: "student" | "teacher" | "institution" | "";
  city: string;
  school: string;
  curriculum?: string;
  level?: string;
  gender: "male" | "female" | "";
}
interface Level {
  _id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}
interface Option {
  label: string;
  value: string;
}

const SignUpPage = () => {
  const navigate = useRouter();
  const locale = useLocale();

  // ------------------ State ------------------
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    city: "",
    school: "",
    curriculum: "",
    level: "",
    gender: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [cities, setCities] = useState<string[]>([]);
  const [schools, setSchools] = useState<string[]>([]);
  const [levelOptions, setLevelOptions] = useState<Option[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const CurriculumsData = [
    { id: 1, name: "Qatari National Curriculum" },
    { id: 2, name: "British Curriculum" },
    { id: 3, name: "American Curriculum" },
    { id: 4, name: "University of Qatar" },
    { id: 5, name: "University of Doha for Science and Technology" },
    { id: 6, name: "Higher education" },
  ];

  // ------------------ Handlers ------------------
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (role: "student" | "teacher" | "institution") => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const validateForm = (): boolean => {
    if (!formData.firstName || !formData.lastName) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!formData.email) {
      toast.error("Please enter your email");
      return false;
    }
    if (!formData.password || formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }
    if (!formData.role) {
      toast.error("Please select your role");
      return false;
    }
    if (!formData.city) {
      toast.error("Please select your city");
      return false;
    }
    if (!formData.school) {
      toast.error("Please select your school");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_DASHBOARD_URL}auth/api/auth/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("🟢 Registration response:", data);

      if (!response.ok) {
        toast.error(data.message || "Registration failed");
        return;
      }

      toast.success(data.message || "Registration successful");

      const { token, user } = data.data;
      if (token && user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
      }
      navigate.push(`/${locale}`);
    } catch (err) {
      console.error("❌ Register error:", err);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  // ------------------ Effects ------------------
  useEffect(() => {
    async function fetchCities() {
      try {
        const cityList = await getCities();
        setCities(cityList);
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    async function fetchLevels() {
      try {
        const levels: Level[] = await getLevels();
        setLevelOptions(
          levels.map((lvl) => ({ label: lvl.name, value: lvl._id }))
        );
      } catch (err) {
        console.error("Error fetching levels:", err);
        setLevelOptions([]);
      }
    }
    fetchLevels();
  }, []);

  useEffect(() => {
    async function fetchSchools() {
      if (!formData.city) return;
      try {
        const schoolList = await getSchools(formData.city);
        setSchools(schoolList);
      } catch (err) {
        console.error("Error fetching schools:", err);
        setSchools([]);
      }
    }
    fetchSchools();
  }, [formData.city]);

  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <div className="flex justify-between bg-[#F7F9FC] sm:flex-col tab:flex-row sm:p-2 tab:p-0  items-center w-full h-full min-h-screen relative">
        <div className="flex justify-center items-center flex-1">
          <div className="shadow-[0px_4px_24px_rgba(0, 0, 0, 0.05)] my-10 bg-white sm:p-4 tab:p-[32px] h-full flex-col rounded-2xl w-full max-w-lg flex justify-center items-center">
            <h1 className="tab:text-3xl sm:text-xl font-semibold text-[#383F34] mb-8 ">
              Let's create an account for you
            </h1>

            <form className="w-full" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="form-group">
                <label>Select your role</label>
                <div
                  className="role-chips w-full "
                  style={{ display: "flex", gap: "12px", marginTop: "8px" }}
                >
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("student")}
                    className={`role-chip w-1/2 ${
                      formData.role === "student" ? "active" : ""
                    }`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      border:
                        formData.role === "student"
                          ? "2px solid ##1A233A"
                          : "2px solid #E5E7EB",
                      borderRadius: "8px",
                      background:
                        formData.role === "student" ? "#F7FAFC" : "#FFFFFF",
                      color:
                        formData.role === "student" ? "##1A233A" : "#6B7280",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <User className="w-5 h-5" />
                    Student
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRoleSelect("teacher")}
                    className={`role-chip w-1/2 ${
                      formData.role === "teacher" ? "active" : ""
                    }`}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "12px 16px",
                      border:
                        formData.role === "teacher"
                          ? "2px solid ##1A233A"
                          : "2px solid #E5E7EB",
                      borderRadius: "8px",
                      background:
                        formData.role === "teacher" ? "#F7FAFC" : "#FFFFFF",
                      color:
                        formData.role === "teacher" ? "##1A233A" : "#6B7280",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <GraduationCap className="w-5 h-5" />
                    Teacher
                  </button>
                  {/* <button
                type="button"
                onClick={() => handleRoleSelect("institution")}
                className={`role-chip ${
                  formData.role === "institution" ? "active" : ""
                }`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 16px",
                  border:
                    formData.role === "institution"
                      ? "2px solid ##1A233A"
                      : "2px solid #E5E7EB",
                  borderRadius: "8px",
                  background:
                    formData.role === "institution" ? "#F7FAFC" : "#FFFFFF",
                  color:
                    formData.role === "institution" ? "##1A233A" : "#6B7280",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                <User className="w-5 h-5" />
                Institution
              </button> */}
                </div>
              </div>

              {/* Basic Information */}
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="Enter your first name"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Enter your last name"
                    required
                  />
                </div>
              </div>

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
                <label htmlFor="gender">Select Gender</label>
                <select
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              {formData.role === "student" && (
                <>
                  <div className="form-group">
                    <label htmlFor="city">Select Your Level</label>
                    <select
                      id="level"
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Level</option>
                      {levelOptions.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="city">Select Your Curriculum</label>
                    <select
                      id="curriculum"
                      name="curriculum"
                      value={formData.curriculum}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Curriculum</option>
                      {CurriculumsData.map((cur) => (
                        <option key={cur.name} value={cur.name}>
                          {cur.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">Select your city</label>
                  <select
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select City</option>
                    {cities.map((city: string) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="school">Select the school</label>
                  <select
                    id="school"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.city}
                  >
                    <option value="">Select School</option>
                    {schools.map((school: string) => (
                      <option key={school} value={school}>
                        {school}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group mt-[-25px]">
                <label htmlFor="password">Create password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="**************"
                    required
                    className="pr-10"
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

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm password</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="**************"
                    required
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <Eye size={20} />
                    ) : (
                      <EyeOff size={20} />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="primary-button"
                disabled={isLoading}
                style={{ backgroundColor: "#1A233A" }}
                icon={isLoading ? Loader : undefined}
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </Button>
            </form>

            <p className="secondary-link">
              Already in the circle? <Link href="/ar/signin">Sign in here</Link>
            </p>

            <p className="footer-text">
              By creating an account, you are agreeing to our{" "}
              <a href="#">privacy policy</a> and <a href="#">terms</a>.
            </p>
          </div>
        </div>

        <div className="flex-1 h-[1280px] sm:hidden tab:block relative flex justify-center items-center bg-[#002347] bg-[url('/images/png/hero.png')] bg-center bg-cover overflow-hidden">
          <div className="relative z-10 text-center text-white">
            <h1 className="text-[64px] font-bold m-0 drop-shadow-[2px_2px_10px_rgba(0,0,0,0.3)]">
              Study Circle
            </h1>
            <p className="text-[20px] mt-4 opacity-90">حــــلــقــــــــــات</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUpPage;
