import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/providers/react-query.provider";
import { CookiesProvider } from "next-client-cookies/server";
import { AlertProvider } from "@/providers/alert.provider";
import Favicon from "./Favicon";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Click",
  description: "O sistema Solar Click oferece uma plataforma web integrada a um sistema embarcado e a uma estrutura de comunicação em nuvem. Nosso sistema embarcado coleta dados em tempo real e os envia, por meio de um protocolo de comunicação seguro, para a nossa plataforma, que armazena e processa as informações, conectando-as ao usuário e ao equipamento correspondente. Através de uma dashboard interativa, os usuários com conta no sistema podem acessar e visualizar diversos parâmetros relacionados ao consumo de energia, permitindo tomar decisões informadas para um uso consciente e eficiente de energia em suas residências.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <Favicon />
      <body className={inter.className}>
        <CookiesProvider>
          <Providers>
            <AlertProvider>
              <>
                {children}
                <Toaster />
              </>
            </AlertProvider>
          </Providers>
        </CookiesProvider>
      </body>
    </html>
  );
}
