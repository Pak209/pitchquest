"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, TrendingUp, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/quest", label: "Play", icon: Gamepad2 },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function BottomNav() {
  const path = usePathname();
  // Hide on home profile picker
  if (path === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-navy/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-lg items-center justify-around px-2 pb-[env(safe-area-inset-bottom)] pt-2">
        {items.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-semibold",
                active ? "text-mint" : "text-white/60 hover:text-white"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
