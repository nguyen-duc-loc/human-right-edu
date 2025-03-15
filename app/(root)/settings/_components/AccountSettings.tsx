"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm, Path } from "react-hook-form";
import { toast } from "sonner";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { changePassword } from "@/lib/api/actions/auth";
import { ChangePasswordData, ChangePassWordSchema } from "@/lib/validation";

const AccountSettings = () => {
  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  const form = useForm<ChangePasswordData>({
    resolver: zodResolver(ChangePassWordSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ChangePasswordData) => {
    const response = await changePassword(data);
    if (!response.success) {
      toast.error(response.error?.message);
    } else {
      toast.success("Thay đổi mật khẩu thành công");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<ChangePasswordData>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {field.name === "password"
                    ? "Mật khẩu mới"
                    : "Xác nhận mật khẩu"}{" "}
                  <span className="text-primary">*</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} type="password" disabled={isSubmitting} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Thay đổi mật khẩu
        </Button>
      </form>
    </Form>
  );
};

export default AccountSettings;
