"use client";

import { Check, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

interface ActionBtnProps {
  btnType: "FOLLOW" | "UNFOLLOW";
  onSubmit: () => Promise<ActionResponse<unknown>>;
  successMessage: string;
}

const ActionBtn = ({
  btnType,
  onSubmit,
  successMessage,
  ...props
}: ActionBtnProps) => {
  const form = useForm();
  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(async () => {
          const response = await onSubmit();
          if (!response.success) {
            toast.error(response.error?.message);
          } else {
            toast.success(successMessage);
          }
        })}
      >
        <Button type="submit" disabled={isSubmitting} {...props}>
          {isSubmitting ? (
            <Spinner />
          ) : btnType === "FOLLOW" ? (
            <Plus />
          ) : (
            <Check />
          )}
          {btnType === "FOLLOW" ? "Theo dõi" : "Đang theo dõi"}
        </Button>
      </form>
    </Form>
  );
};

export default ActionBtn;
