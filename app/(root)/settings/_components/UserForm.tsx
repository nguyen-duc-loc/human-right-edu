"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Path, useForm } from "react-hook-form";
import { toast } from "sonner";

import Spinner from "@/components/Spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUser } from "@/lib/api/actions/users";
import { UserData, UserSchema } from "@/lib/validation";

interface UserFormProps {
  defaultValues: UserData;
}

const UserForm = ({ defaultValues }: UserFormProps) => {
  const form = useForm({
    resolver: zodResolver(UserSchema),
    defaultValues,
  });

  const handleSubmit = async (data: UserData) => {
    const response = await updateUser(data);
    if (!response.success) {
      toast.error(response.error?.message);
    } else {
      toast.success("Cập nhật thông tin thành công");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <Avatar className="size-28 border">
          <AvatarImage
            src={form.getValues("avatar")}
            alt={`${form.getValues("username")} avatar`}
          />
          <AvatarFallback className="text-2xl">
            {form.getValues("username")[0]?.toUpperCase() || "A"}
          </AvatarFallback>
        </Avatar>
        {Object.keys(defaultValues).map((field) => (
          <FormField
            key={field}
            control={form.control}
            name={field as Path<UserData>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {field.name === "username"
                    ? "Tên người dùng"
                    : field.name === "avatar"
                    ? "Link ảnh đại diện"
                    : field.name === "email"
                    ? "Email"
                    : "Tiểu sử"}{" "}
                  {(field.name === "username" || field.name === "email") && (
                    <span className="text-primary">*</span>
                  )}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isSubmitting}
                    className="min-h-12"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button disabled={isSubmitting}>
          {isSubmitting && <Spinner />}
          Cập nhật thông tin
        </Button>
      </form>
    </Form>
  );
};

export default UserForm;
