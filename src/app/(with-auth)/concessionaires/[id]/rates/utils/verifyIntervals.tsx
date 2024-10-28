import { NewRateSchemaType } from "@/schemas/new-rates.schema";

const END_OF_DAY_IN_MINUTES = 1439;

export function verifyIfIntervalFillsAllDay(
  intervals: NewRateSchemaType["intervalos_tarifas"]
) {
  const sortedIntervalsAsc = intervals
    .filter((intervalo) => intervalo.de !== null && intervalo.ate !== null)
    .sort((a, b) => (a.de || 0) - (b.de || 0));

  let isCompleteDayCovered = true;
  let previousEnd = 0;

  for (const intervalo of sortedIntervalsAsc) {
    if (intervalo.de! > previousEnd) {
      isCompleteDayCovered = false;
      break;
    }
    previousEnd = intervalo.ate!;
  }

  // Verifica se o último intervalo termina exatamente no final do dia (1439 minutos)
  if (previousEnd !== END_OF_DAY_IN_MINUTES) {
    isCompleteDayCovered = false;
  }

  return isCompleteDayCovered;
}
