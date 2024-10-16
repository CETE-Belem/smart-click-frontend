import { NewRateSchemaType } from "@/schemas/new-rates.schema";

export function verifyIfIntervalFillsAllDay(intervals: NewRateSchemaType["intervalos_tarifas"]) {
  const sortedIntervals = intervals
  .filter((intervalo) => intervalo.de !== null && intervalo.ate !== null)
  .sort((a, b) => (a.de || 0) - (b.de || 0));

let isCompleteDayCovered = true;
let previousEnd = 0;

for (const intervalo of sortedIntervals) {
  if (intervalo.de! > previousEnd) {
    isCompleteDayCovered = false;
    break;
  }
  previousEnd = intervalo.ate!;
}

// Verifica se o último intervalo termina exatamente no final do dia (1440 minutos)
if (previousEnd !== 1440) {
  isCompleteDayCovered = false;
}
console.log(isCompleteDayCovered);
return isCompleteDayCovered;
}