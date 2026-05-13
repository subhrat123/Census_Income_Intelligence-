"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/constants/nav";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border/60 bg-card/40 p-4 lg:block">
      <div className="mb-6 px-2">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Census Platform</p>
        <h2 className="text-lg font-semibold">Income Intelligence</h2>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const ActiveIcon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <ActiveIcon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
