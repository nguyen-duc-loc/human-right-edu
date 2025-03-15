import React from "react";

import { getMe } from "@/lib/api/data/users";

import UserForm from "./UserForm";

const InformationSettings = async () => {
  const me = await getMe();
  if (!me) {
    return null;
  }

  const { username, bio, avatar, email } = me;

  return (
    <UserForm
      defaultValues={{
        avatar: avatar ?? "",
        username,
        email,
        bio: bio ?? "",
      }}
    />
  );
};

export default InformationSettings;
