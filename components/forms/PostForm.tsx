"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import {
  DefaultValues,
  FieldValues,
  Path,
  PathValue,
  useForm,
} from "react-hook-form";
import { toast } from "sonner";
import { ZodType } from "zod";

import ROUTES from "@/constants/routes";

import AttachedLink from "../post/AttachedLink";
import File from "../post/File";
import Tag from "../post/Tag";
import Spinner from "../Spinner";
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

interface PostFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse<unknown>>;
  addedFiles?: PostFile[];
  formType: "CREATE" | "EDIT";
}

const PostForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
  addedFiles,
}: PostFormProps<T>) => {
  const router = useRouter();

  const form = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
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
        form.setValue(
          "tags" as Path<T>,
          [...field.value, tagInput] as PathValue<T, Path<T>>
        );
        e.currentTarget.value = "";
        form.clearErrors("tags" as Path<T>);
      } else if (tagInput.length > 50) {
        form.setError("tags" as Path<T>, {
          type: "manual",
          message: "Tên chủ đề không được quá 50 ký tự",
        });
      } else if (field.value.includes(tagInput)) {
        form.setError("tags" as Path<T>, {
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

      const linkInput = e.currentTarget.value.trim();

      if (linkInput && !field.value.includes(linkInput)) {
        form.setValue(
          "links" as Path<T>,
          [...field.value, linkInput] as PathValue<T, Path<T>>
        );
        e.currentTarget.value = "";
        form.clearErrors("links" as Path<T>);
      } else if (field.value.includes(linkInput)) {
        form.setError("links" as Path<T>, {
          type: "manual",
          message: "Link đã tồn tại",
        });
      }
    }
  };

  const handleTagRemove = (tag: string, field: { value: string[] }) => {
    const newTags = field.value.filter((t) => t !== tag);

    form.setValue("tags" as Path<T>, newTags as PathValue<T, Path<T>>);

    if (newTags.length === 0) {
      form.setError("tags" as Path<T>, {
        type: "manual",
        message: "Hãy tạo ít nhất 1 chủ đề",
      });
    }
  };

  const handleLinkRemove = (url: string, field: { value: string[] }) => {
    const newLinks = field.value.filter((u) => u !== url);
    form.setValue("links" as Path<T>, newLinks as PathValue<T, Path<T>>);
  };

  const handleFileRemove = (fileId: string, field: { value: string[] }) => {
    const newRemovedFiles = [...field.value, fileId];
    form.setValue(
      "removedFiles" as Path<T>,
      newRemovedFiles as PathValue<T, Path<T>>
    );
  };

  const handleSubmit = async (data: T) => {
    const response = await onSubmit(data);
    if (!response.success) {
      toast.error(response.error?.message);
    } else {
      if (formType === "CREATE") {
        form.reset();
      }
      const { slug } = response.data as { slug: string };
      router.push(ROUTES.post(slug));
      toast.success(
        `${formType === "CREATE" ? "Tạo" : "Chỉnh sửa"} tài liệu thành công`
      );
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
          name={"title" as Path<T>}
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
          name={"content" as Path<T>}
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
          name={"tags" as Path<T>}
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
                      {field?.value?.map((tag: string) => (
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
          name={"links" as Path<T>}
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
                      {field?.value?.map((link: string, idx: number) => (
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
          name={"files" as Path<T>}
          control={form.control}
          render={() => (
            <FormItem className="flex w-full flex-col gap-2">
              <FormLabel>Tệp đính kèm</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".pdf,.docx,.ppt,.pptx,.doc,.png,.jpg"
                  className="max-w-72"
                  multiple
                  onChange={(e) =>
                    form.setValue(
                      "files" as Path<T>,
                      (e.target.files
                        ? Array.from(e.target.files)
                        : []) as PathValue<T, Path<T>>
                    )
                  }
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {formType === "EDIT" && addedFiles && addedFiles.length > 0 && (
          <FormField
            name={"removedFiles" as Path<T>}
            control={form.control}
            render={({ field }) => (
              <div className="flex max-w-[800px] flex-wrap gap-4">
                {addedFiles
                  .filter((file) => !field.value.includes(file.fileId))
                  .map((file) => (
                    <File
                      key={`file-${file.fileId}`}
                      file={file}
                      remove
                      handleRemove={() => handleFileRemove(file.fileId, field)}
                    />
                  ))}
              </div>
            )}
          />
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner />
            ) : formType === "CREATE" ? (
              <Plus />
            ) : (
              <Check />
            )}
            {formType === "CREATE" ? "Tạo" : "Chỉnh sửa"} tài liệu
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PostForm;
