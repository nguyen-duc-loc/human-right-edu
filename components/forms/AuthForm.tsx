"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { ZodType } from "zod";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ROUTES from "@/constants/routes";

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse<unknown>>;
  formType: "SIGN_IN" | "SIGN_UP";
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data: T) => {
    const response = await onSubmit(data);
    if (!response.success) {
      toast.error(response.error?.message);
    } else {
      form.reset();
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="w-[500px] max-sm:px-8"
      >
        <Card className="w-full">
          <CardHeader className="pb-8">
            <CardTitle className="text-2xl">
              {formType === "SIGN_IN" ? "Đăng nhập" : "Đăng ký"}
            </CardTitle>
            <CardDescription className="!mt-0">
              Hãy điền thông tin{" "}
              {formType === "SIGN_IN"
                ? "đăng nhập để truy cập Human Right Edu"
                : "đăng ký để tạo tài khoản mới"}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            {Object.keys(defaultValues).map((field) => (
              <FormField
                key={field}
                control={form.control}
                name={field as Path<T>}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name === "username"
                        ? "Tên người dùng"
                        : field.name === "password"
                        ? "Mật khẩu"
                        : field.name === "email"
                        ? "Email"
                        : field.name.charAt(0).toUpperCase() +
                          field.name.slice(1)}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type={field.name === "password" ? "password" : "text"}
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button className="w-full" type="submit" disabled={isSubmitting}>
              {isSubmitting && <Spinner />}
              {formType === "SIGN_IN" ? "Đăng nhập" : "Đăng ký"}
            </Button>
            <p className="flex flex-wrap items-center gap-1 text-sm">
              {formType === "SIGN_IN" ? "Chưa" : "Đã"} có tài khoản?{" "}
              <Link
                href={`${
                  formType === "SIGN_IN" ? ROUTES.signUp : ROUTES.signIn
                }`}
                className="flex p-0 font-bold text-primary"
              >
                {formType === "SIGN_IN" ? "Đăng ký" : "Đăng nhập"} ngay{" "}
                <IconArrowNarrowRight className="size-5" />
              </Link>
            </p>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
};

export default AuthForm;
