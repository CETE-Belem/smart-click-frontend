import { Button } from "@/components/ui/button";
import { Routes } from "@/enums/Routes.enum";
import { Equipments } from "@/types/equipments";
import { LoaderCircle, PenBoxIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NoResult from "./no-result";

interface CardViewProps<T extends Record<string, any>> {
  accessorKey: keyof T;
  data: T[];
  columns: CardColumnDef<T>[];
  isLoading?: boolean;
}

export interface CardColumnDef<T> {
  cell: (props: { data: T }) => JSX.Element;
}

export default function CardView<T extends Record<string, any>>({
  data,
  columns,
  accessorKey,
  isLoading,
}: CardViewProps<T>) {
  return (
    <div className="flex flex-col w-full sm:hidden gap-3">
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={index}
            className="bg-[#F5F5F5] rounded-lg shadow-input p-4 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="ml-4 text-[#58585A]">
                  {columns.map((column, index) => (
                    <div key={index}>{column.cell({ data: item })}</div>
                  ))}
                </div>
              </div>
              <div>
                {accessorKey && item[accessorKey] && (
                  <Link
                    href={Routes.EquipmentsEdit.replace(
                      "[id]",
                      String(item[accessorKey])
                    )}
                    className="w-fit p-3"
                  >
                    <PenBoxIcon size={24} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))
      ) : (
        <>
          {isLoading ? (
            <div className="flex justify-center items-center">
              <LoaderCircle className="w-8 h-8 mr-2 animate-spin text-solaris-primary" />
            </div>
          ) : (
            <NoResult />
          )}
        </>
      )}
    </div>
  );
}
