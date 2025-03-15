"use client";

import {
  IconHome,
  IconSettings,
  IconRosetteDiscountCheck,
  IconHomeFilled,
  IconRosetteDiscountCheckFilled,
  IconUserFilled,
  IconUser,
  IconLogout2,
  IconLogin,
  IconSettingsFilled,
  IconSquareRoundedPlus,
  IconSquareRoundedPlusFilled,
  IconTag,
  IconTagFilled,
} from "@tabler/icons-react";
import React from "react";

import ROUTES from "@/constants/routes";
import { SidebarProvider } from "@/contexts/sidebar";

import Logo from "./Logo";
import SidebarBody from "./SidebarBody";
import SidebarLink, { Links } from "./SidebarLink";
import SidebarUser from "./SidebarUser";

interface SidebarContainerProps {
  animate?: boolean;
  user?: {
    username: string;
    email: string;
    avatar: string | null;
  } | null;
}

const SidebarContainer = ({ animate, user }: SidebarContainerProps) => {
  const [open, setOpen] = React.useState(false);

  const isSignedIn = !!user;
  let links: Links[] = [
    {
      id: "home",
      label: "Trang chủ",
      href: ROUTES.home,
      icon: IconHome,
      iconFilled: IconHomeFilled,
    },
    {
      id: "tags",
      label: "Chủ đề",
      href: ROUTES.tags,
      icon: IconTag,
      iconFilled: IconTagFilled,
    },
  ];
  if (isSignedIn) {
    links = links.concat([
      {
        id: "newPost",
        label: "Tạo tài liệu",
        href: ROUTES.newPost,
        icon: IconSquareRoundedPlus,
        iconFilled: IconSquareRoundedPlusFilled,
      },
      {
        id: "following",
        label: "Đang theo dõi",
        href: ROUTES.following,
        icon: IconRosetteDiscountCheck,
        iconFilled: IconRosetteDiscountCheckFilled,
      },
      {
        id: "profile",
        label: "Trang cá nhân",
        href: ROUTES.user(user.username),
        icon: IconUser,
        iconFilled: IconUserFilled,
      },
      {
        id: "settings",
        label: "Cài đặt",
        href: ROUTES.settings,
        icon: IconSettings,
        iconFilled: IconSettingsFilled,
      },
      {
        id: "signout",
        label: "Đăng xuất",
        href: "#",
        icon: IconLogout2,
      },
    ]);
  } else {
    links = links.concat([
      {
        id: "auth",
        label: "Đăng nhập / Đăng ký",
        href: ROUTES.signIn,
        icon: IconLogin,
      },
    ]);
  }

  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate}>
      <SidebarBody className="justify-between gap-10 border-r lg:sticky lg:top-0">
        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          <Logo />
          <ul className="mt-12 flex flex-col gap-2">
            {links.map((link) => (
              <SidebarLink key={link.id} link={link} />
            ))}
          </ul>
        </div>
        {user && <SidebarUser user={user} />}
      </SidebarBody>
    </SidebarProvider>
  );
};

export default SidebarContainer;
