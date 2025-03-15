"use client";

import { motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { removeKeysFromQuery, formUrlQuery } from "@/lib/url";

import { TabName } from "../page";

interface SidebarProps {
  currentTab: TabName;
}

const Sidebar = ({ currentTab }: SidebarProps) => {
  const tabs: TabName[] = ["information", "account", "appearance"];
  const searchParams = useSearchParams();
  const router = useRouter();

  function handleSwitchTab(tab: TabName) {
    let newUrl: string;

    if (tab === "information") {
      newUrl = removeKeysFromQuery({
        params: searchParams.toString(),
        keysToRemove: ["tab"],
      });
    } else {
      newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "tab",
        value: tab,
      });
    }

    router.push(newUrl, { scroll: false });
  }

  return (
    <nav className="flex basis-1/3 flex-wrap gap-2 lg:flex-col">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={"ghost"}
          className={`group/btn grow px-6 capitalize hover:bg-primary/15 hover:font-semibold lg:mb-2 lg:grow-0 lg:justify-start ${
            currentTab === tab
              ? "bg-primary/15 font-semibold text-primary"
              : "font-normal"
          }`}
          onClick={() => handleSwitchTab(tab)}
        >
          <motion.span className="transition duration-150 group-hover/btn:translate-x-1 group-hover/btn:text-primary">
            {tab === "information"
              ? "Thông tin cá nhân"
              : tab === "account"
              ? "Tài khoản"
              : "Giao diện"}
          </motion.span>
        </Button>
      ))}
    </nav>
  );
};

export default Sidebar;
