// src/components/auth/AuthLayout.tsx
import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="auth-container flex justify-center items-center min-h-screen  bg-cover bg-center">
      {children}
    </div>
  );
};

export default AuthLayout;
