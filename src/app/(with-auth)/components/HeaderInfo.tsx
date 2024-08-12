"use client";
import { Briefcase, Building, ChevronsRight, HomeIcon, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface HeaderInfoData {
  [key: string]: {
    title: string;
    icon: JSX.Element;
  };
}

const headerInfoData: HeaderInfoData = {
  "/dashboard": {
    title: "Dashboard",
    icon: <HomeIcon size={24} />,
  },
  "/dashboard/consumer-unit": {
    title: "Unidades Consumidoras",
    icon: <Building size={24} />,
  },
  "/dashboard/equipments": {
    title: "Equipamentos",
    icon: <Briefcase size={24} />,
  },
  "/dashboard/equipments/new": {
    title: "Novo Equipamento",
    icon: <Plus size={24} />,
  },
};

export default function HeaderInfo() {
  const pathname = usePathname();
  const filteredPathname = pathname.split("/").filter((item) => item !== "");
  const finalLinksArray = filteredPathname.map((item, index, array) => {
    const currentLinkArray = array.slice(0, index + 1);
    return {
      title: headerInfoData[`/${currentLinkArray.join("/")}`]?.title,
      icon: headerInfoData[`/${currentLinkArray.join("/")}`]?.icon,
      url: `/${currentLinkArray.join("/")}`,
    };
  });
  const lastRoute = finalLinksArray[finalLinksArray.length - 1];
  const headerTitle = lastRoute.title;
  return (
    <>
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold text-white">{headerTitle}</h1>
        <div className="flex gap-4 items-center">
          {finalLinksArray.map((item, index) => {
            return (
              <div key={index} className="flex gap-2 items-center">
                <div
                  className="flex gap-2 items-center text-sm text-white"
                >
                  {item.icon}
                  {index === finalLinksArray.length - 1 ? (
                    <p className="text-sm">{item.title}</p>
                  ) : (
                    <Link href={`${item.url}`}>
                      <p className="text-sm hover:underline">{item.title}</p>
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
      </div>
    </>
  );
}
