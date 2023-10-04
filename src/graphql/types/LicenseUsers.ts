import { builder } from "../builder";

builder.prismaObject('licence_users', {
  fields: (t) => ({
    licenceId: t.exposeID('licence_id'),
    licenceStart: t.exposeInt('licence_active', {nullable: true}),
    licenceExpire: t.exposeString('userId', {nullable: true}),
    licenceStatus: t.exposeString('assigned_by', {nullable: true}),
    companyId: t.expose('assigned_at', {type: "Date", nullable: true}),
  })
})

builder.queryField('licence_users', (t) =>
  t.prismaConnection({
    type: 'licence_users',
    cursor: 'licence_id_licence_no',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.licence_users.findMany({ ...query })
  })
)