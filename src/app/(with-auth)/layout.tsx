import { ScrollArea } from "@/components/ui/scroll-area"
import ColoredLogo from "../../../public/images/colored-logo.svg"
import Image from "next/image";
import { Building, HomeIcon } from "lucide-react";
import SidebarMenuItem from "./components/SidebarMenuItem";

export default function DashboardLayout(props: {children: React.ReactNode}) {
  return (
    <div className="grid grid-cols-dashboard min-h-screen w-full">
      <aside className="w-full h-full flex flex-col">
        <div className="h-44 flex items-center justify-center">
          <Image src={ColoredLogo} alt="Logo do Smart Click" height={100} width={100} />
        </div>
        <div className="flex flex-col">
          <SidebarMenuItem href="/dashboard" label="Dashboard">
            <HomeIcon height={24} width={24} />
          </SidebarMenuItem>
          <SidebarMenuItem href="/consumer-unit" label="Unidades Consumidoras">
            <Building height={24} width={24} />
          </SidebarMenuItem>
        </div>
      </aside>
      <div className="w-full h-full">
        <ScrollArea className="flex flex-col h-[calc(100vh-11rem)]">
          {props.children}
        </ScrollArea>
      </div>
    </div>
  )
}