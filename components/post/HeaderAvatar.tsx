import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderAvatarProps {
  image: string | null;
  username: string;
}

const HeaderAvatar = ({ image, username }: HeaderAvatarProps) => {
  return (
    <Avatar className="size-9">
      <AvatarImage src={image ?? undefined} alt={`${username} avatar`} />
      <AvatarFallback>{username[0].toUpperCase()}</AvatarFallback>
    </Avatar>
  );
};

export default HeaderAvatar;
