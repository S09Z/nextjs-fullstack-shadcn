// graphql/schema.ts

import { builder } from "./builder";

import "./types/Link"
import "./types/Users"

export const schema = builder.toSchema()