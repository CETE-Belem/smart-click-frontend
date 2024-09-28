"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "./label";
import dayjs from "dayjs";

interface DatePickerProps {
  label: string;
  placeholder: string;
  date: Date;
  setDate: (date: Date | undefined) => void;
  className?: string;
}

export function DatePicker({
  label,
  placeholder,
  date = new Date(),
  setDate,
  className,
}: DatePickerProps & { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className={cn("flex flex-col gap-[10px]", className)}>
          <Label className="text-sm font-medium text-[#333333] opacity-70">
            {label}
          </Label>
          <Button
            type="button"
            variant="solar-input"
            className={cn(
              "w-[280px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
              className
            )}
          >
            {date ? (
              dayjs(date).format("DD/MM/YYYY")
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  );
}
