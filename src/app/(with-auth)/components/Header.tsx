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
import { useQueryClient } from "@tanstack/react-query";
import useUserStore from "@/store/user.store";
import Link from "next/link";
import { useCookies } from "next-client-cookies";
import { useRouter } from "next/navigation";
import { Routes } from "@/enums/Routes.enum";

//TODO: Transform in a composing component
export default function Header() {
  const user = useUserStore((state) => state.user);
  const queryClient = useQueryClient();
  const cookies = useCookies();
  const router = useRouter();

  async function handleLogout() {
    router.prefetch(Routes.Login);
    cookies.remove("token");
    queryClient.invalidateQueries();
    router.push(Routes.Login);
  }
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
            <DropdownMenuContent
              className="bg-dropProfile text-white hover:bg-dropProfile"
              align="end"
            >
              {/* <DropdownMenuLabel>Ações</DropdownMenuLabel> */}
              <Link
                href={Routes.EditProfile.replace("[id]", user?.cod_usuario!)}
              >
                <DropdownMenuItem>Editar</DropdownMenuItem>
              </Link>

              <DropdownMenuItem onClick={handleLogout}>Sair</DropdownMenuItem>
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
