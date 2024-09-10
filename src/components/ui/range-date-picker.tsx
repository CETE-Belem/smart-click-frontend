"use client";

import * as React from "react";
import { addDays, format, startOfMonth, subMonths, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRange, SelectRangeEventHandler } from "react-day-picker";
import dayjs from "dayjs";

interface RangeDatePickerProps {
  date: DateRange;
  setDate: (date: DateRange) => void;
  month: Date;
  setMonth: (date: Date) => void;
}

export default function RangeDatePicker({
  date,
  setDate,
  month,
  setMonth,
}: RangeDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"solar-input"}
          className={cn(
            "w-fit justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date?.from && date?.to ? (
            dayjs(date.from).isSame(dayjs(date.to), "day") ? (
              format(date.from, "dd/MM/yyyy", { locale: ptBR })
            ) : (
              `${format(date.from, "dd/MM/yyyy", { locale: ptBR })} - ${format(date.to, "dd/MM/yyyy", { locale: ptBR })}`
            )
          ) : (
            <span>Selecione duas datas</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="end" sideOffset={10}>
        <div className="flex items-center justify-around space-x-2 p-3 border-b">
          <Select
            value={format(month, "MMMM", { locale: ptBR })}
            onValueChange={(value) =>
              setMonth(new Date(month.getFullYear(), parseInt(value)))
            }
          >
            <SelectTrigger className="w-fit">
              <SelectValue>
                {format(month, "MMMM", { locale: ptBR })}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {format(new Date(0, i), "MMMM", { locale: ptBR })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={month.getFullYear().toString()}
            onValueChange={(value) =>
              setMonth(new Date(parseInt(value), month.getMonth()))
            }
          >
            <SelectTrigger className="w-fit">
              <SelectValue>{month.getFullYear()}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => {
                const year = new Date().getFullYear() - 10 + i;
                return (
                  <SelectItem key={i} value={year.toString()}>
                    {year}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <Calendar
            mode="range"
            selected={date}
            onSelect={setDate as SelectRangeEventHandler}
            month={month}
            onMonthChange={setMonth}
            numberOfMonths={1}
            className="p-3"
          />
        </div>
        <div className="flex flex-row-reverse w-full items-center px-4 py-2 gap-2">
          <Button
            size="sm"
            onClick={() => setDate({ from: undefined, to: undefined })}
          >
            Limpar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setMonth(new Date(new Date().getFullYear(), new Date().getMonth()))
            }
          >
            Mês Atual
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
