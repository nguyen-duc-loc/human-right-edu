import React from "react";

import { getMe } from "@/lib/api/data/users";

import SidebarContainer from "./SidebarContainer";

const Sidebar = async () => {
  try {
    const me = await getMe();

    return <SidebarContainer animate={false} user={me} />;
  } catch {
    return <SidebarContainer animate={false} />;
  }
};

export default Sidebar;
