import SchemaBuilder from "@pothos/core";
import PrismaPlugin from '@pothos/plugin-prisma';
import prisma from "../lib/prisma";
import type PrismaTypes from '@pothos/plugin-prisma/generated';
import RelayPlugin from "@pothos/plugin-relay";
import {createContext} from './context'
import { DateTimeResolver} from "graphql-scalars";

export const builder = new SchemaBuilder<{
  PrismaTypes: PrismaTypes,
  Context: ReturnType<typeof createContext>,
  Scalars: {
    Date: {
      Input: Date;
      Output: Date;
    };
  };
}>({
  plugins: [PrismaPlugin, RelayPlugin],
  relayOptions: {},
  prisma: {
    client: prisma,
  }
})

builder.queryType({
  fields: (t) => ({
    ok: t.boolean({
      resolve: () => true,
    }),
  }),
  
});

builder.addScalarType("Date", DateTimeResolver, {});
builder.mutationType({})