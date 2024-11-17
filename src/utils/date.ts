import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { capitalize } from 'lodash';

export interface AgendaDayObject {
  date: Date;
  str: string;
  short: string;
  number: string;
}

export const formatDate = (date: Date): AgendaDayObject => ({
  date: date,
  str: format(date, 'dd-MM-yyyy'),
  short: capitalize(format(date, 'cccccc', { locale: ptBR })),
  number: format(date, 'dd'),
});
