"use client";
import {
  Briefcase,
  Building,
  ChevronsRight,
  Fish,
  PenIcon,
  PenSquareIcon,
  Plus,
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
  };
};

const headerInfoData: HeaderInfoData = {
  [Routes.ConsumerUnit]: {
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
    subtitle: "Editar equipamento id: [id]",
    icon: <PenSquareIcon size={24} />,
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
          <div className="flex gap-4 items-center">
            {finalLinksArray.map((item, index) => {
              return (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex gap-2 items-center text-sm text-white">
                    {item.icon}
                    {index === finalLinksArray.length - 1 ? (
                      <p className="text-sm">{item.subtitle}</p>
                    ) : (
                      <Link
                        className="focus:outline-none focus:ring-1 focus:ring-ring rounded-sm focus:ring-offset-2 focus:ring-offset-transparent"
                        href={`${item.url}`}
                      >
                        <p className="text-sm hover:underline">
                          {item.subtitle}
                        </p>
                      </Link>
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
