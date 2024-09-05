import Link from "next/link";
import Image from "next/image";
import notFoundImage from "public/images/404-error.svg";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="w-screen h-screen flex items-center justify-center text-">
      <div className="w-full h-full px-7 flex flex-col gap-5 items-center justify-center max-w-[630px] max-h-[710px]">
        <h1 className="text-center text-3xl sm:text-5xl lg:text-6xl font-bold text-secondary-foreground">
          Página <span className="text-solaris-primary">não encontrada</span>
        </h1>
        <p className="text-xs sm:text-sm lg:text-lg text-center">
          Desculpe, não conseguimos encontrar o que você procura. Volte para a
          tela principal e tente novamente.
        </p>
        <Button variant="solar">
          <Link href="/">Voltar a página principal</Link>
        </Button>
        <Image
          src={notFoundImage}
          alt="Página não encontrada"
          className="w-[330px] h-[330px]"
        />
      </div>
    </div>
  );
}
