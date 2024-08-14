import NoResultImage from "@/images/no-result.svg";
import Image from "next/image";
import { Button } from "./ui/button";

export default function NoResult() {
  return (
    <div className="flex flex-col w-full items-center justify-center text-center">
      <Image src={NoResultImage} alt="Sem Resultados" className="mb-2" />
      <h3 className="text-black text-xl font-bold">Sem Resultados</h3>
      <p className="text-xs text-[#58585A]">
        O item que você estava procurando não foi encontrado.
      </p>
      <Button variant="solar" className="mt-4" onClick={() => {}}>
        Limpar Filtro
      </Button>
    </div>
  );
}
