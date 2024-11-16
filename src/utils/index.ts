import { Blueprint as Bp } from '@cicerotcv/blueprint';

const titleSchema = Bp.lorem.sentence(3).transform((s) => s.replace('.', ''));
const descriptionSchema = Bp.lorem.sentences(5);
const dateSchema = Bp.date.between('2024-11-15', '2024-11-30');

const todoSchema = Bp.object({
  id: Bp.datatype.uuid(),
  title: titleSchema,
  description: descriptionSchema,
  date: dateSchema,
});

const todoCollectionSchema = Bp.array({
  minLength: 30,
  maxLength: 40,
  schema: todoSchema,
});

export const todoCollection = todoCollectionSchema.compile();
