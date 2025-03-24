import { z } from "zod";

export const SignUpSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên người dùng không được để trống." })
    .max(50, { message: "Tên người dùng không được quá 50 ký tự." })
    .regex(/^[a-zA-Z_0-9]+$/, {
      message: "Tên người dùng chỉ bao gồm các chữ cái, số hoặc dấu gạch dưới.",
    })
    .refine((val) => !(val[0] >= "0" && val[0] <= "9"), {
      message: "Tên người dùng không được bắt đầu bằng chữ số.",
    }),

  email: z
    .string()
    .min(1, { message: "Email không được để trống." })
    .email({ message: "Email không hợp lệ." }),

  password: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự." })
    .max(50, { message: "Mật khẩu không được quá 50 ký tự." }),
});
export type SignUpData = z.infer<typeof SignUpSchema>;

export const SignInSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên người dùng không được để trống" })
    .max(50, { message: "Tên người dùng không được quá 50 ký tự" })
    .regex(/^[a-zA-Z_0-9]+$/, {
      message: "Tên người dùng chỉ bao gồm các chữ cái, số hoặc dấu gạch dưới",
    })
    .refine((val) => !(val[0] >= "0" && val[0] <= "9"), {
      message: "Tên người dùng không được bắt đầu bằng chữ số",
    }),

  password: z
    .string()
    .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
    .max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
});
export type SignInData = z.infer<typeof SignInSchema>;

export const CreatePostSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Tiêu đề không được để trống" })
    .max(100, { message: "Tiêu đề không được quá 100 ký tự" }),

  content: z
    .string()
    .min(1, { message: "Nội dung không được để trống" })
    .max(1000, { message: "Nội dung không được quá 1000 ký tự" }),

  tags: z
    .array(
      z
        .string()
        .min(1, { message: "Tên chủ đề không được để trống" })
        .max(50, "Tên chủ đề không được quá 50 ký tự")
    )
    .min(1, { message: "Hãy tạo ít nhất 1 chủ đề" })
    .max(10, { message: "Không được tạo quá 10 chủ đề" }),
  links: z
    .array(z.string().min(1, { message: "Link không được để trống" }))
    .max(10, { message: "Không được tạo quá 10 link" }),
  files: z
    .array(
      z
        .custom<File>((file) => file instanceof File, {
          message: "Phải là kiểu file",
        })
        .refine(
          (file) => file.size <= 100 * 1024 * 1024,
          "Kích thước file không được vượt quá 100MB"
        )
        .refine(
          (file) =>
            [
              "application/pdf",
              "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              "application/vnd.ms-powerpoint",
              "application/vnd.openxmlformats-officedocument.presentationml.presentation",
              "image/png",
              "image/jpeg",
              "application/msword",
            ].some((type) => file.type === type),
          "Định dạng file không hợp lệ"
        )
    )
    .max(10, { message: "Không được chọn quá 10 tệp" }),
});
export type CreatePostData = z.infer<typeof CreatePostSchema>;

export const EditPostSchema = CreatePostSchema.extend({
  removedFiles: z.array(
    z.string().min(1, { message: "File bị xoá không được để trống" })
  ),
});
export type EditPostData = z.infer<typeof EditPostSchema>;

export const CommentSchema = z.object({
  content: z
    .string()
    .min(1, { message: "Bình luận không được để trống" })
    .max(1000, { message: "Binh luận không được quá 1000 ký tự" }),
});
export type CommentData = z.infer<typeof CommentSchema>;

export const AppearanceSchema = z.object({
  theme: z.enum(["light", "dark", "system"], {
    required_error: "Please select a theme.",
  }),
});
export type AppearanceData = z.infer<typeof AppearanceSchema>;

export const UserSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Tên người dùng không được để trống." })
    .max(50, { message: "Tên người dùng không được quá 50 ký tự." })
    .regex(/^[a-zA-Z_0-9]+$/, {
      message: "Tên người dùng chỉ bao gồm các chữ cái, số hoặc dấu gạch dưới.",
    })
    .refine((val) => !(val[0] >= "0" && val[0] <= "9"), {
      message: "Tên người dùng không được bắt đầu bằng chữ số.",
    }),

  email: z
    .string()
    .min(1, { message: "Email không được để trống." })
    .email({ message: "Email không hợp lệ." }),

  bio: z.optional(
    z.string().max(60, { message: "Tiểu sử không được quá 60 ký tự." })
  ),

  avatar: z.optional(z.string()),
});
export type UserData = z.infer<typeof UserSchema>;

export const ChangePassWordSchema = z
  .object({
    password: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
    confirmPassword: z
      .string()
      .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
      .max(50, { message: "Mật khẩu không được quá 50 ký tự" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu không khớp",
  });
export type ChangePasswordData = z.infer<typeof ChangePassWordSchema>;
