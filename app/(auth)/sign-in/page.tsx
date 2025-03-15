import { Metadata } from "next";
import React from "react";

import SignInForm from "./_components/SignInForm";

export const metadata: Metadata = {
  title: "Đăng nhập",
  description: "Đăng nhập",
};

const SignInPage = () => {
  return <SignInForm />;
};

export default SignInPage;
