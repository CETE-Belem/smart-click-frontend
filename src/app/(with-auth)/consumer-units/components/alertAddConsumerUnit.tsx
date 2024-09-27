"use client";
import { linkConsumerUnitAction } from "@/action/edit-user-action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Routes } from "@/enums/Routes.enum";
import {
  LinkConsumerUnitSchema,
  LinkConsumerUnitSchemaType,
} from "@/schemas/link-consumer-unit.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { CirclePlus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

export const AlertAddConsumerUnit = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [value, setValue] = useState<string>("");
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<LinkConsumerUnitSchemaType>({
    defaultValues: {
      number: "",
    },
    resolver: zodResolver(LinkConsumerUnitSchema),
  });

  async function linkConsumerUnit(values: LinkConsumerUnitSchemaType) {
    router.prefetch(Routes.ConsumerUnits);
    setLoading(true);

    await linkConsumerUnitAction(values)
      .then((response) => {
        console.log(response);
        if (response.success) {
          toast({
            title: "Sucesso",
            description: response.message,
            variant: "success",
          });
          queryClient.invalidateQueries({ queryKey: ["consumer-units"] });
          router.push(Routes.ConsumerUnits);
          setOpen(false);
        } else {
          toast({
            title: "Erro",
            description: response.message,
            variant: "destructive",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        toast({
          title: "Erro",
          description: error.message,
          variant: "destructive",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger>
        <Button variant="solar" className="w-fit p-3 gap-2">
          <CirclePlus size={24} />
          Adicionar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-72 sm:max-w-96 flex flex-col gap-8 items-center justify-center p-9 overflow-hidden border-none rounded-[1.25rem]">
        <AlertDialogCancel asChild>
          <Button className="self-end p-2 border-none">
            <X size={24} className="text-black" />
          </Button>
        </AlertDialogCancel>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(linkConsumerUnit)}>
            <AlertDialogTitle className="text-3xl font-bold text-secondary-foreground text-center items-stretch">
              <span className="text-solaris-primary">Registrar</span> unidade
              consumidora
            </AlertDialogTitle>
            <AlertDialogDescription className="flex flex-col gap-4 text-center">
              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        label="Número da unidade consumidora"
                        placeholder="0 0 0 0 0 0 0 0"
                        className="text-center"
                        required
                        invalid={!!!form.formState.errors.number}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </AlertDialogDescription>

            <Button
              type="submit"
              variant="solar"
              disabled={value === ""}
              loading={loading}
            >
              <AlertDialogAction className="bg-transparent hover:bg-transparent">
                Concluir
              </AlertDialogAction>
            </Button>
          </form>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
};
