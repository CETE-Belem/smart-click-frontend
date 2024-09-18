import React from "react";
import { Briefcase, Building, UserRound, Zap } from "lucide-react";
import SidebarMenuItem from "./SidebarMenuItem";
import { Routes } from "@/enums/Routes.enum";
// Importação sem uso
import { Role } from "@/enums/Role.enum";
import useUserStore from "@/store/user.store";

export default function MenuItems() {
  // Variável sem uso
  const user = useUserStore((state) => state.user);
  return (
    <>
      {user?.perfil === Role.ADMIN && (
        <SidebarMenuItem href={Routes.Users} label="Usuários">
          <UserRound size={24} />
        </SidebarMenuItem>
      )}
      <SidebarMenuItem href={Routes.Concessionaires} label="Concessionárias">
        <Zap height={24} width={24} />
      </SidebarMenuItem>
      <SidebarMenuItem
        href={Routes.ConsumerUnits}
        label="Unidades Consumidoras"
      >
        <Building height={24} width={24} />
      </SidebarMenuItem>
      <SidebarMenuItem href={Routes.Equipments} label="Equipamentos">
        <Briefcase height={24} width={24} />
      </SidebarMenuItem>
      {user?.perfil === Role.ADMIN && (
        <SidebarMenuItem href={Routes.Concessionaires} label="Concessionárias">
          <Zap height={24} width={24} />
        </SidebarMenuItem>
      )}
      {user?.perfil === Role.ADMIN && (
        <SidebarMenuItem href={Routes.Users} label="Usuários">
          <UserRound size={24} />
        </SidebarMenuItem>
      )}
    </>
  );
}
