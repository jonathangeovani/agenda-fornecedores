import { Blueprint as Bp } from '@cicerotcv/blueprint';

const nameSchema = Bp.names.fullName();
const phoneSchema = Bp.phone.number('(!#) 9####-####');
const dateSchema = Bp.date.between('2024-11-12', '2024-11-30');

const supplierSchema = Bp.object({
  id: Bp.datatype.uuid(),
  name: nameSchema,
  phone: phoneSchema,
  date: dateSchema,
});

const supplierCollectionSchema = Bp.array({
  minLength: 30,
  maxLength: 40,
  schema: supplierSchema,
});

export const supplierCollection = supplierCollectionSchema.compile();
