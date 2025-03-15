"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import HeaderAvatar from "@/components/post/HeaderAvatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import ROUTES from "@/constants/routes";
import { comment } from "@/lib/api/actions/comments";
import { CommentData, CommentSchema } from "@/lib/validation";

interface CommentAreaProps {
  me: User | null;
  postSlug: string;
}

const CommentArea = ({ me, postSlug }: CommentAreaProps) => {
  const form = useForm<CommentData>({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      content: "",
    },
  });

  const onSubmit = async (data: CommentData) => {
    const response = await comment(postSlug, data);
    if (!response.success) {
      toast.error(response.error?.message);
    } else {
      form.reset();
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  if (!me) {
    return (
      <div className="py-6 text-center">
        <p className="pb-2">Đăng nhập để bình luận</p>
        <Button>
          <Link href={ROUTES.signIn}>Đăng nhập</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-3 py-6">
      <HeaderAvatar image={me.avatar} username={me.username} />
      <Form {...form}>
        <form className="grow" noValidate>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Thêm bình luận"
                    className="resize-none"
                    {...field}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        form.handleSubmit(onSubmit)();
                      }
                    }}
                    disabled={isSubmitting}
                    maxLength={500}
                  />
                </FormControl>
                <FormMessage className="text-sm" />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
};

export default CommentArea;
