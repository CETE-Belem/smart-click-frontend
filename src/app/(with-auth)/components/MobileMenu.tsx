import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Briefcase, Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import SidebarMenuItem from "./SidebarMenuItem";
import { Routes } from "@/enums/Routes.enum";
import ColoredLogo from "@/images/colored-logo.svg";
import MenuItems from "./MenuItems";

export default function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="link" size="icon" className="shrink-0 lg:hidden">
          <div className="flex h-12 w-12 p-3 bg-[#F5F5F5] rounded-full items-center justify-center">
            <Menu size={24} className="text-black" />
          </div>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col p-0 pt-12">
        <div className="w-full flex items-center justify-center">
          <Image
            src={ColoredLogo}
            alt="Logo do Smart Click"
            height={100}
            width={100}
          />
        </div>
        <nav className="grid text-lg font-medium mt-9">
          <MenuItems />
        </nav>
      </SheetContent>
    </Sheet>
  );
}
