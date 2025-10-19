import { DateObject } from "react-multi-date-picker";
import moment from "moment/moment";

const ISO = "DD.MM.YYYY";

/** из DateObject[] -> string[] ('YYYY-MM-DD'), уникализуем и сортируем */
export function pickerToIso(dates: DateObject[]): string[] {
  return Array.from(new Set(dates.map(d => d.format(ISO)))).sort();
}

/** из string[] ('YYYY-MM-DD') -> DateObject[] (для value пикера) */
export function isoToPicker(days: string[]): DateObject[] {
  return days.map(d => new DateObject({ date: d, format: ISO }));
}

export function formatWorkingDays(days?: string[] | null): string {
  if (!days || days.length === 0) return '—';

  const parse = (s: string) =>
    moment(s, ["YYYY-MM-DD", "DD.MM.YYYY", moment.ISO_8601], true);

  // нормализуем к ISO для уникализации и сортировки
  const iso = days
    .map((d) => parse(d))
    .filter((m) => m.isValid())
    .map((m) => m.format("YYYY-MM-DD"));

  // уникализуем и сортируем
  const uniqueSorted = Array.from(new Set(iso)).sort();

  // формат вывода
  return uniqueSorted
    .map((d) => moment(d, "YYYY-MM-DD").format("DD.MM.YYYY"))
    .join(", ");
}