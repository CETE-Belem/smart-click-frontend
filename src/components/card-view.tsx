import { Button } from "@/components/ui/button";
import { Routes } from "@/enums/Routes.enum";
import {
  Edit,
  LoaderCircle,
  MoreHorizontal,
  PenBoxIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import NoResult from "./no-result";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface CardViewProps<T extends Record<string, any>> {
  accessorKey: keyof T;
  data: T[];
  columns: CardColumnDef<T>[];
  isLoading?: boolean;
  canDelete?: boolean;
  canEdit?: boolean;
  editRoute?: ((item: T) => string) | string;
  handleDelete?: (data: T) => void;
  customMobileActions?: (data: T) => JSX.Element;
}

export interface CardColumnDef<T> {
  cell: (props: { data: T }) => JSX.Element;
}

export default function CardView<T extends Record<string, any>>({
  data,
  columns,
  accessorKey,
  isLoading,
  canEdit = false,
  editRoute,
  canDelete = false,
  handleDelete = () => {},
  customMobileActions,
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
                {(canDelete || canEdit) && accessorKey && item[accessorKey] && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="link" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Ações</DropdownMenuLabel>
                      {customMobileActions && customMobileActions(item)}
                      {canEdit && (
                        <Link
                          href={
                            typeof editRoute === "function"
                              ? editRoute(item)
                              : (editRoute?.replace(
                                  "[id]",
                                  item[accessorKey]
                                ) ?? "")
                          }
                        >
                          <DropdownMenuItem>
                            <Edit size={16} className="mr-2" />
                            Editar
                          </DropdownMenuItem>
                        </Link>
                      )}
                      {canDelete && (
                        <DropdownMenuItem onClick={() => handleDelete(item)}>
                          <Trash2
                            size={16}
                            className="mr-2 text-red-600 hover:text-red-600"
                          />
                          <span className="text-red-600 hover:text-red-600">
                            Excluir
                          </span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
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
