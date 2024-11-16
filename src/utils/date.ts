import { format } from 'date-fns';

export interface AgendaDayObject {
  date: Date;
  str: string;
  short: string;
  number: string;
}

export const formatDate = (date: Date): AgendaDayObject => ({
  date: date,
  str: format(date, 'dd-MM-yyyy'),
  short: format(date, 'ccc'),
  number: format(date, 'dd'),
});
