"use client";

import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signup } from "@/lib/api/actions/auth";
import { SignUpSchema } from "@/lib/validation";

const SignUpForm = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      defaultValues={{
        email: "",
        username: "",
        password: "",
      }}
      onSubmit={(data) => signup(data)}
    />
  );
};

export default SignUpForm;
