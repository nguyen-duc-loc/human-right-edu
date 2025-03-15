type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details: Record<string, string[]>;
  };
  status: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;
type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

type StorageObject = {
  Url: string;
  Key: string;
  LastModified: Date;
  Size: number;
  StorageClass: string;
};

interface UserModel {
  id: number;
  username: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  hashedPassword: string;
}

interface FileModel {
  fileId: string;
  postId: string;
  name: string;
  createdAt: Date;
}

type PostModel = {
  postId: number;
  slug: string;
  authorId: number;
  title: string;
  content: string;
  tags: string[];
  links: string[];
  createdAt: Date;
};

interface CommentModel {
  postId: number;
  userId: number;
  content: string;
  createdAt: Date;
}

interface FileModel {
  postId: number;
  fileId: string;
  name: string;
  createdAt: Date;
}

type AuthTokenPayload = { userId: number };

type SignInResponseData = {
  token: string;
};

type User = Omit<UserModel, "id" | "hashedPassword">;

type Tag = {
  name: string;
  count: number;
};

type CreateUserResponseData = Omit<
  UserModel,
  "avatar" | "bio" | "hashedPassword"
>;

type UpdateUserResponseData = Omit<UserModel, "id" | "hashedPassword">;

type GetUserResponseData =
  | (Omit<UserModel, "hashedPassword"> & {
      postCount: number;
      followerCount: number;
      followingCount: number;
      following: boolean;
    })
  | null;

type CreatePostResponseData = PostModel &
  Omit<FileModel, "postId", "createdAt">[];

type GetPostBySlugResponseData = Omit<PostModel, "postId" | "authorId"> & {
  authorUsername: string;
  authorAvatar: string | null;
  numLikes: string;
  numComments: string;
  liked: boolean;
};

type GetPostsResponseData = {
  posts: GetPostBySlugResponseData[];
  nextPage?: number;
};

type GetTopPostsResponseData = { title: string; slug: string }[];

type GetTagsResponseData = {
  total: number;
  tags: Tag[];
};

type Comment = Omit<CommentModel, "postId" | "userId"> & {
  commenterUsername: string;
  commenterAvatar: string;
};

type GetCommentsInPost = (Omit<CommentModel, "postId" | "userId"> & {
  commenterUsername: string;
  commenterAvatar: string;
})[];

type PostFile = Omit<FileModel, "postId" | "fileId" | "createdAt"> & {
  url: string | null;
};

type GetFilesInPostResponseData = PostFile[];
