const ROUTES = {
  home: "/",
  tags: "/tags",
  newPost: "/post/new",
  following: "/following",
  settings: "/settings",
  signIn: "/sign-in",
  signUp: "/sign-up",
  tag: (name: string) => `/tag/${name}`,
  post: (slug: string) => `/post/${slug}`,
  user: (username: string) => `/user/${username}`,
};

export default ROUTES;
