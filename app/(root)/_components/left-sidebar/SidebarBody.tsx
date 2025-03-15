import { motion } from "framer-motion";
import React from "react";

import DesktopSidebar from "./DesktopSidebar";
import MobileSidebar from "./MobileSidebar";

const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<"div">)} />
    </>
  );
};

export default SidebarBody;
