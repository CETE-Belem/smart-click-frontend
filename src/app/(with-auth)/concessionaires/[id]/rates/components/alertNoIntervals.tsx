"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { GoAlertFill } from "react-icons/go";

interface AlertNoIntervalsProps {
  open: boolean;
  onClose: () => void; // Recebe uma função para fechar o alerta
}

export default function AlertNoIntervals({
  open,
  onClose,
}: AlertNoIntervalsProps) {
  return (
    <AlertDialog open={open} onOpenChange={onClose}>
      <AlertDialogContent className="p-0 overflow-hidden border-none max-w-72 flex flex-col items-center justify-center pb-5">
        <AlertDialogHeader>
          <div className="h-28 px-8 flex items-center justify-center solaris-background-header">
            <GoAlertFill className="h-16 w-16 text-white" />
          </div>
          <div className="p-5 space-y-4">
            <AlertDialogTitle className="text-center">
              A tarifa não apresenta intervalos!
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              As tarifas devem conter intervalo(s) para serem cadastradas. Por
              favor, adicione os intervalos tarifários necessários.
            </AlertDialogDescription>
          </div>
        </AlertDialogHeader>

        <Button
          variant="solar"
          onClick={() => {
            onClose();
          }}
        >
          Entendi
        </Button>
      </AlertDialogContent>
    </AlertDialog>
  );
}
