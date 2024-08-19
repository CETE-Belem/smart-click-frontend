"use client";
import { ScrollArea } from "@/components/ui/scroll-area"
import ColoredLogo from "../../../public/images/colored-logo.svg"
import Image from "next/image";
import { Briefcase, Building } from "lucide-react";
import SidebarMenuItem from "./components/SidebarMenuItem";
import Header from "./components/Header";
import Link from "next/link";
import { Routes } from "@/enums/Routes.enum";
import MenuItems from "./components/MenuItems";

export default function SystemLayout(props: {children: React.ReactNode}) {
  return (
    <div className="flex lg:grid lg:grid-cols-dashboard min-h-screen w-full">
      <aside className="hidden w-full h-full lg:flex flex-col">
        <div className="h-[9.813rem] flex items-center justify-center">
          <Link href={Routes.Equipments}>
            <Image src={ColoredLogo} alt="Logo do Smart Click" height={100} width={100} />
          </Link>
        </div>
        <div className="flex flex-col">
          <MenuItems />
        </div>
      </aside>
      <div className="w-full h-full">
        <ScrollArea className="flex flex-col h-screen">
          <Header />
          <div className="px-12 pt-5">
            {props.children}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}