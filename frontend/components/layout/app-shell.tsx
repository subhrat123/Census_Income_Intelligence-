import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { TopNavbar } from "@/components/layout/top-navbar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <TopNavbar />
      <div className="mx-auto flex max-w-[1400px]">
        <AppSidebar />
        <main className="w-full p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
