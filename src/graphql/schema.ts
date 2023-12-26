// graphql/schema.ts

import { builder } from "./builder";

import "./types/Link"
import "./types/Users"
import "./types/Companies"
import "./types/License"
import "./types/LicenseUsers"

export const schema = builder.toSchema()