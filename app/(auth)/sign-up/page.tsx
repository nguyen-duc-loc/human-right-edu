import { Metadata } from "next";
import React from "react";

import SignUpForm from "./_components/SignUpForm";

export const metadata: Metadata = {
  title: "Đăng ký",
  description: "Đăng ký",
};

const SignUpPage = () => {
  return <SignUpForm />;
};

export default SignUpPage;
