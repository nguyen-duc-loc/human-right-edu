import { Metadata } from "next";
import React from "react";

import { Separator } from "@/components/ui/separator";

import AccountSettings from "./_components/AccountSettings";
import AppearanceSettings from "./_components/AppearanceSettings";
import InformationSettings from "./_components/InformationSettings";
import Sidebar from "./_components/Sidebar";

export const metadata: Metadata = {
  title: "Cài đặt",
  description: "Cài đặt",
};

export type TabName = "information" | "account" | "appearance";

const SettingsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) => {
  const { tab = "" } = await searchParams;
  const defaultTab: TabName = "information";
  const currentTab = (tab as TabName) || defaultTab;

  return (
    <div className="mx-auto max-w-[800px] ">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col gap-8 lg:flex-row">
        <Sidebar currentTab={currentTab} />
        <div className="grow basis-2/3 space-y-6">
          {currentTab === "information" ? (
            <InformationSettings />
          ) : currentTab === "account" ? (
            <AccountSettings />
          ) : (
            <AppearanceSettings />
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
