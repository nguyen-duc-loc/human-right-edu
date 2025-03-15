"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import ROUTES from "@/constants/routes";
import { createPost } from "@/lib/api/actions/posts";
import { CreatePostData, CreatePostSchema } from "@/lib/validation";

import AttachedLink from "../AttachedLink";
import Spinner from "../Spinner";
import Tag from "../Tag";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const PostForm = () => {
  const router = useRouter();

  const form = useForm<CreatePostData>({
    resolver: zodResolver(CreatePostSchema),
    defaultValues: {
      title: "",
      content: "",
      tags: [],
      files: [],
      links: [],
    },
  });

  const handleTagInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: {
      value: string[];
    }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const tagInput = e.currentTarget.value.trim().toLowerCase();

      if (
        tagInput &&
        tagInput.length <= 50 &&
        !field.value.includes(tagInput)
      ) {
        form.setValue("tags", [...field.value, tagInput]);
        e.currentTarget.value = "";
        form.clearErrors("tags");
      } else if (tagInput.length > 50) {
        form.setError("tags", {
          type: "manual",
          message: "Tên chủ đề không được quá 50 ký tự",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags", {
          type: "manual",
          message: "Tên chủ đề đã tồn tại",
        });
      }
    }
  };

  const handleLinkInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    field: {
      value: string[];
    }
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();

      const linkInput = e.currentTarget.value.trim().toLowerCase();

      if (linkInput && !field.value.includes(linkInput)) {
        form.setValue("links", [...field.value, linkInput]);
        e.currentTarget.value = "";
        form.clearErrors("links");
      } else if (field.value.includes(linkInput)) {
        form.setError("links", {
          type: "manual",
          message: "Link đã tồn tại",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags", newTags);

    if (newTags.length === 0) {
      form.setError("tags", {
        type: "manual",
        message: "Hãy tạo ít nhất 1 chủ đề",
      });
    }
  };

  const handleLinkRemove = (url: string, field: { value: string[] }) => {
    const newLinks = field.value.filter((u) => u !== url);
    form.setValue("links", newLinks);
  };

  const handleSubmit = async (data: CreatePostData) => {
    const response = await createPost(data);
    if (!response.success) {
      toast.error(response.error?.message);
    } else {
      form.reset();
      const { slug } = response.data as CreatePostResponseData;
      router.push(ROUTES.post(slug));
      toast.success("Tạo tài liệu thành công");
    }
  };

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        className="flex w-full flex-col gap-10"
        onSubmit={form.handleSubmit(handleSubmit)}
        noValidate
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel>
                Tiêu đề <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Input
                  required
                  {...field}
                  className="min-h-12"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription>
                Hãy nhập tiêu đề ngắn gọn, rõ ràng để thu hút người đọc
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel>
                Nội dung <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-36 resize-none"
                  required
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormDescription className="">
                Viết nội dung chi tiết cho tài liệu của bạn
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel>
                Chủ đề <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    required
                    placeholder="Thêm chủ đề..."
                    className="min-h-12"
                    onKeyDown={(e) => handleTagInputKeyDown(e, field)}
                    disabled={isSubmitting}
                  />
                  {field.value.length > 0 && (
                    <div className="mt-2.5 flex flex-wrap gap-2.5">
                      {field?.value?.map((tag) => (
                        <Tag
                          key={tag}
                          name={tag}
                          remove
                          handleRemove={() => handleTagRemove(tag, field)}
                          disabled={isSubmitting}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Nhập các chủ đề liên quan giúp tài liệu dễ dàng được tìm thấy,
                tối đa 5 chủ đề. Nhấn Enter để thêm chủ đề.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="links"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel>
                Link đính kèm <span className="text-primary">*</span>
              </FormLabel>
              <FormControl>
                <div>
                  <Input
                    required
                    placeholder="Thêm link..."
                    className="min-h-12"
                    onKeyDown={(e) => handleLinkInputKeyDown(e, field)}
                    disabled={isSubmitting}
                  />
                  {field.value.length > 0 && (
                    <ul className="my-4 ml-8 list-disc [&>li]:mt-2">
                      {field?.value?.map((link, idx) => (
                        <li key={`link-${idx}`}>
                          <AttachedLink
                            url={link}
                            remove
                            handleRemove={() => handleLinkRemove(link, field)}
                            disabled={isSubmitting}
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </FormControl>
              <FormDescription>
                Nhập các liên kết đính kèm cho tài liệu. Nhấn Enter để thêm liên
                kết.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="files"
          control={form.control}
          render={() => (
            <FormItem>
              <FormLabel>Tệp đính kèm</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.docx,.ppt,.pptx,.doc,.png,.jpg"
                  className="max-w-72"
                  multiple
                  onChange={(e) =>
                    form.setValue(
                      "files",
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner /> : <Plus />}
            Tạo tài liệu
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
