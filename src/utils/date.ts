import {
  format,
  addDays,
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  subWeeks,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { capitalize } from 'lodash';

export interface AgendaDayObject {
  date: Date;
  str: string;
  short: string;
  long: string;
  number: string;
}

export const formatDate = (date: Date): AgendaDayObject => ({
  date: date,
  str: format(date, 'dd-MM-yyyy'),
  short: capitalize(format(date, 'cccccc', { locale: ptBR })),
  long: capitalize(format(date, 'cccc', { locale: ptBR })),
  number: format(date, 'dd'),
});

export const getWeekDays = (day: Date) => {
  const weekInterval = eachWeekOfInterval({
    start: subWeeks(day, 0),
    end: addWeeks(day, 0),
  });
  const weekDays = weekInterval.map((start) => {
    return eachDayOfInterval({ start, end: addDays(start, 6) })
      .map(formatDate)
      .map((date) => date.str);
  });
  return weekDays[0];
};
