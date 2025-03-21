import React from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-primary/15">
      {children}
    </div>
  );
};

export default AuthLayout;
