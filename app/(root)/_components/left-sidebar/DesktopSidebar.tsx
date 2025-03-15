import { motion } from "framer-motion";
import React from "react";

import { useSidebar } from "@/contexts/sidebar";
import { cn } from "@/lib/utils";

const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();

  return (
    <>
      <motion.aside
        className={cn(
          "h-full px-5 pt-10 pb-4 hidden lg:flex lg:flex-col flex-shrink-0",
          className
        )}
        animate={{
          width: animate ? (open ? "250px" : "64px") : "250px",
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </motion.aside>
    </>
  );
};

export default DesktopSidebar;
