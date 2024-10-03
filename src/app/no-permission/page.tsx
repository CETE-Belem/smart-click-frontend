"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import noPermission from "public/images/no-permission.svg";

export default function NoPermission() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3 items-center justify-center h-screen">
      <div className="flex flex-col gap-3 text-center items-center max-w-sm">
        <Image src={noPermission} alt="No permission" className="max-w-64" />
        <h1 className="text-2xl font-bold text-[#37474F]">Não Autorizado</h1>
        <p className="text-secondary-foreground">
          Você não possui as permissões necessárias para visualizar esta pagina.
        </p>
        <Button
          onClick={() => router.replace("/consumer-units")}
          variant="solar"
          className="w-fit"
        >
          Voltar
        </Button>
      </div>
    </div>
  );
}
