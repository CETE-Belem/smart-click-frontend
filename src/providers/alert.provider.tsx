"use client";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { GoAlertFill } from "react-icons/go";

type AlertOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
};

type AlertContextType = {
  openAlert: (options: AlertOptions) => Promise<boolean>;
  closeAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [confirmText, setConfirmText] = useState("Sim");
  const [cancelText, setCancelText] = useState("Não");
  const [resolvePromise, setResolvePromise] = useState<
    ((value: boolean) => void) | null
  >(null);

  const openAlert = ({
    title,
    description,
    confirmText = "Sim",
    cancelText = "Não",
  }: AlertOptions): Promise<boolean> => {
    setTitle(title);
    setDescription(description);
    setConfirmText(confirmText);
    setCancelText(cancelText);
    setIsOpen(true);

    return new Promise<boolean>((resolve) => {
      setResolvePromise(() => resolve);
    });
  };

  const closeAlert = () => {
    setIsOpen(false);
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
  };

  const handleConfirm = () => {
    if (resolvePromise) {
      resolvePromise(true);
      setResolvePromise(null);
    }
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolvePromise) {
      resolvePromise(false);
      setResolvePromise(null);
    }
    setIsOpen(false);
  };

  return (
    <AlertContext.Provider value={{ openAlert, closeAlert }}>
      {children}
      <AlertDialog open={isOpen} onOpenChange={closeAlert}>
        <AlertDialogContent className="p-0 overflow-hidden border-none max-w-72">
          <AlertDialogHeader>
            <div className="h-28 px-8 flex items-center justify-center solaris-background-header">
              <GoAlertFill className="h-16 w-16 text-white" />
            </div>
            <div className="p-5 space-y-4">
              <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
              <AlertDialogDescription className="text-center">
                {description}
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <div className="flex items-center justify-center gap-3 px-5 pb-5">
            <Button variant="solar-outline" onClick={handleCancel}>
              {cancelText}
            </Button>
            <Button variant="solar" onClick={handleConfirm}>
              {confirmText}
            </Button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};