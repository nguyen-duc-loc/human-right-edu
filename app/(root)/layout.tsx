import React from "react";

import LeftSidebar from "./_components/left-sidebar/Sidebar";
import RightSidebar from "./_components/right-sidebar/Sidebar";

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto h-screen w-full overflow-auto dark:bg-background md:flex md:flex-row">
      <LeftSidebar />
      <section className="h-fit min-h-screen grow bg-primary/10 px-8 pb-8 pt-16 max-md:pt-20 sm:px-20">
        {children}
      </section>
      <RightSidebar />
    </div>
  );
};

export default RootLayout;
