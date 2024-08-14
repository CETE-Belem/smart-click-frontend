"use client";
import { User } from "lucide-react";
import HeaderInfo from "./HeaderInfo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutAction } from "@/action/logout.action";
import useUser from "@/hooks/useUser";
import { useQueryClient } from "@tanstack/react-query";

//TODO: Transform in a composing component
export default function Header() {
  const { user, loading } = useUser();
  const queryClient = useQueryClient();
  return (
    <div className="h-fit lg:h-[9.813rem] solaris-background-header">
      <div className="flex justify-between py-5 p-7 lg:pt-12 lg:pl-16 lg:pr-10">
        <HeaderInfo />
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="h-10 w-10 bg-white rounded-full flex justify-center items-center cursor-pointer">
                <User size={26} className="text-black" />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* <DropdownMenuLabel>Ações</DropdownMenuLabel> */}
              <DropdownMenuItem onClick={async () => await logoutAction()}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="hidden lg:block">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-bold text-muted-foreground">
                {user?.nome.split(" ")[0]}
              </p>
              <p className="text-2xs font-medium text-muted-foreground">
                {user?.perfil}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
