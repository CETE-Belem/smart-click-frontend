import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTimeToMinutes(time: string, format: string): number {
  const timeObject = dayjs(time, format);

  // Validação se o parsing foi bem-sucedido
  if (!timeObject.isValid()) {
    throw new Error("Formato de tempo inválido");
  }

  const hours = timeObject.hour();
  const minutes = timeObject.minute();

  return hours * 60 + minutes;
}

export function convertMinutesToTimeString(minutes: number): string {
  let hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours == 24) hours = 0;

  // Formatar manualmente a string de horas e minutos
  const timeString = `${hours.toString().padStart(2, "0")}:${remainingMinutes
    .toString()
    .padStart(2, "0")}`;

  return timeString; // Devolver o tempo no formato HH:mm
}

// Trata o valor recebido para o formato de dinheiro:
// Ex.:
// 24.000000 -> 24.00
export function formatMoney(value: number): number {
  return parseFloat(value.toFixed(2));
}

// Trata o valor recebido para o formato de dinheiro:
// Ex.:
// 24.000000 -> R$ 24,00
export function formatCurrency(value: any) {
  if (!value) return "";

  const numberValue = parseFloat(value.toString().replace(/[^\d]/g, ""));
  return numberValue.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
