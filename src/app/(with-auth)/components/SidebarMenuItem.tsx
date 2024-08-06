"use client";
import { ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { usePathname } from "next/navigation";

interface SidebarMenuItemProps {
  children: ReactNode;
  label: string;
  href: string;
}

export default function SidebarMenuItem({ children, label, href}: SidebarMenuItemProps) {
  const pathname = usePathname();
  return (
    <Link href={href} className={cn("h-14 flex gap-y-7 px-10 py-2 items-center", {
      "bg-solaris-primary": pathname === href
    })}>
      <Slot className={cn("stroke-muted-foreground", {
        "stroke-white": pathname === href
      })}>
        {children}
      </Slot>
      <span className={cn("ml-4 text-sm text-muted-foreground", {
        "text-white": pathname === href
      })}>{label}</span>
    </Link>
  );
}