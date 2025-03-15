"use client";

import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signin } from "@/lib/api/actions/auth";
import { SignInSchema } from "@/lib/validation";

const SignInForm = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      defaultValues={{
        username: "",
        password: "",
      }}
      onSubmit={(data) => signin(data)}
    />
  );
};

export default SignInForm;
