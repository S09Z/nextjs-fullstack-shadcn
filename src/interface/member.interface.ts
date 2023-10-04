import * as t from 'io-ts';
import { optional } from 'io-ts-extra';

export const memberSchema = t.type({
  id: t.string,
  firstName: optional(t.string),
  lastName: optional(t.string),
  email: optional(t.string),
});


export type Members = t.TypeOf<
  typeof memberSchema
>;