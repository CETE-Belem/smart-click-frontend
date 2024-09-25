"use client";
import {
  Briefcase,
  Building,
  ChevronsRight,
  NotebookTextIcon,
  NotepadText,
  Pencil,
  PenSquareIcon,
  Plus,
  Zap,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { Routes } from "@/enums/Routes.enum";
import MobileMenu from "./MobileMenu";

type HeaderInfoData = {
  [key: string]: {
    title: string;
    subtitle: string;
    icon: JSX.Element;
    adminOnly?: boolean;
  };
};

const headerInfoData: HeaderInfoData = {
  [Routes.ConsumerUnits]: {
    title: "Unidades Consumidoras",
    subtitle: "Unidades Consumidoras",
    icon: <Building size={24} />,
  },
  [Routes.Equipments]: {
    title: "Equipamentos",
    subtitle: "Equipamentos",
    icon: <Briefcase size={24} />,
  },
  [Routes.EquipmentsNew]: {
    title: "Equipamentos",
    subtitle: "Cadastrar equipamento",
    icon: <Plus size={24} />,
  },
  [Routes.EquipmentsEdit]: {
    title: "Equipamento",
    subtitle: "Editar equipamento",
    icon: <PenSquareIcon size={24} />,
  },
  [Routes.Equipment]: {
    title: "Equipamento",
    subtitle: "Informações do equipamento",
    icon: <NotebookTextIcon size={24} />,
  },
  [Routes.ConcessionaireNew]: {
    title: "Concessionárias",
    subtitle: "Cadastrar Concessionária",
    icon: <Plus size={24} />,
  },
  [Routes.Concessionaire]: {
    title: "Concessionárias",
    subtitle: "Informações Concessionária",
    icon: <NotepadText size={24} />,
  },
  [Routes.ConcessionaireEdit]: {
    title: "Concessionárias",
    subtitle: "Editar Concessionária",
    icon: <Pencil size={24} />,
  },
  [Routes.Concessionaires]: {
    title: "Concessionárias",
    subtitle: "Concessionárias",
    icon: <Zap size={24} />,
  },
  [Routes.ConsumerUnitNew]: {
    title: "Unidades Consumidoras",
    subtitle: "Cadastrar Unidade Consumidora",
    icon: <Plus size={24} />,
  },
  [Routes.ConsumerUnit]: {
    title: "Unidades Consumidoras",
    subtitle: "Informações Unidade Consumidora",
    icon: <NotepadText size={24} />,
  },
  [Routes.ConsumerUnitEdit]: {
    title: "Unidades Consumidoras",
    subtitle: "Editar Unidade Consumidora",
    icon: <Pencil size={24} />,
  },
  [Routes.Users]: {
    title: "Usuários",
    subtitle: "Usuários",
    icon: <UserRound size={24} />,
  },
  [Routes.User]: {
    title: "Usuários",
    subtitle: "Informações do usuário",
    icon: <NotepadText size={24} />,
  },
  [Routes.AdminNew]: {
    title: "Usuários",
    subtitle: "Cadastrar usuário",
    icon: <Plus size={24} />,
  },
  [Routes.UserEdit]: {
    title: "Usuários",
    subtitle: "Editar usuário",
    adminOnly: true,
    icon: <Pencil size={24} />,
  },
  [Routes.EditProfile]: {
    title: "Editar Perfil",
    subtitle: "Editar perfil",
    icon: <Pencil size={24} />,
  },
  [Routes.EquipmentConstant]: {
    title: "Equipamento",
    subtitle: "Assistente de Calibração",
    icon: <NotebookTextIcon size={24} />,
  },
};

export default function HeaderInfo() {
  const pathname = usePathname();
  const params = useParams();
  const filteredPathname = pathname.split("/").filter((item) => item !== "");
  const finalLinksArray = filteredPathname.map((item, index, array) => {
    const currentLinkArray = array.slice(0, index + 1);

    const routeKey = Object.keys(headerInfoData).find((route) => {
      const regex = new RegExp(`^${route.replace(/\[.*?\]/g, "[^/]+")}$`);

      return regex.test(`/${currentLinkArray.join("/")}`);
    });

    const data = headerInfoData[routeKey || ""];
    return {
      title: data?.title,
      icon: data?.icon,
      subtitle: data?.subtitle,
      url: `/${currentLinkArray.join("/")}`,
      adminOnly: data?.adminOnly,
    };
  });

  const lastRoute = finalLinksArray[finalLinksArray.length - 1];
  const headerTitle = lastRoute?.title || "";

  return (
    <>
      <div className="flex flex-col gap-5 lg:gap-6">
        <MobileMenu />
        {finalLinksArray.length > 1 ? (
          <h1 className="text-3xl lg:text-4xl font-bold text-white">
            {headerTitle}
          </h1>
        ) : (
          <div className="text-white flex gap-2 items-center justify-center">
            {finalLinksArray[0]?.icon}
            <h1 className="text-3xl lg:text-4xl flex-1 font-bold text-white">
              {headerTitle}
            </h1>
          </div>
        )}
        {finalLinksArray.length > 1 && (
          <div className="flex flex-wrap gap-4 items-center">
            {finalLinksArray.map((item, index) => {
              return (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex gap-2 items-center text-sm text-white">
                    {item.icon}
                    {index === finalLinksArray.length - 1 ? (
                      <p className="text-sm">{item.subtitle}</p>
                    ) : (
                      <>
                        {
                          !item.adminOnly ? (
                            <Link href={item.url}>
                              {item.subtitle}
                            </Link>
                          ) : (
                            <p className="text-sm">{item.subtitle}</p>
                          )
                        }
                      </>
                    )}
                  </div>
                  {index !== finalLinksArray.length - 1 && (
                    <ChevronsRight size={22} className="text-white" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
