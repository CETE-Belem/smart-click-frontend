"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { apiClient } from "@/lib/axios-client";
import { ConsumerUnit } from "@/types/unidade-consumidora";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus, X } from "lucide-react";
import { useCookies } from "next-client-cookies";

export const AlertAddConsumerUnit = () => {
  const cookies = useCookies();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  async function addConsumerUnit(data: ConsumerUnit) {
    try {
      await apiClient
        .patch(`/consumer-unit/me`, {
          headers: {
            Authorization: `Bearer ${cookies.get("token")}`,
          },
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["consumer-units"] });
          toast({
            title: "Unidade consumidora excluída com sucesso",
            description: `A unidade consumidora ${data.numero} foi excluída com sucesso`,
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: `Ocorreu um erro ao excluir a unidade consumidora`,
            description: error.response.data.message,
            variant: "destructive",
          });
        });
    } catch (error) {
      console.log(error);
      toast({
        title: `Erro ao excluir a unidade consumidora`,
        description: `Ocorreu um erro ao excluir a unidade consumidora ${data.numero}`,
        variant: "destructive",
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <Button
          onClick={() => addConsumerUnit}
          variant="solar"
          className="w-fit p-3 gap-2"
        >
          <CirclePlus size={24} />
          Adicionar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex flex-col gap-9 items-center justify-center p-14 overflow-hidden border-none max-w-72 rounded-3xl">
        <AlertDialogCancel asChild>
          <Button className="self-end p-2 border-none">
            <X size={24} className="text-black" />
          </Button>
        </AlertDialogCancel>

        <AlertDialogTitle className="text-3xl font-bold text-secondary-foreground text-center items-stretch">
          <span className="text-solaris-primary">Registrar</span> unidade
          consumidora
        </AlertDialogTitle>
        <AlertDialogDescription className="flex flex-col gap-4 text-center">
          <Label>Unidade Consumidora</Label>
          <Input placeholder="0 0 0 0 0 0 0 0" className="text-center" />
        </AlertDialogDescription>

        <AlertDialogAction asChild className="">
          <Button variant="solar" onClick={() => addConsumerUnit}>
            Concluir
          </Button>
        </AlertDialogAction>
      </AlertDialogContent>
    </AlertDialog>
  );
};
