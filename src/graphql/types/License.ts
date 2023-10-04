import { builder } from "../builder";

builder.prismaObject('licences', {
  fields: (t) => ({
    licenceId: t.exposeID('licence_id'),
    licenceStart: t.expose('licence_start', {type: "Date", nullable: true}),
    licenceExpire: t.expose('licence_expire', {type: "Date", nullable: true}),
    licenceStatus: t.exposeInt('licence_status', {nullable: true}),
    companyId: t.exposeString('companyId', { nullable: true, }),
  })
})

builder.queryField('licences', (t) =>
  t.prismaConnection({
    type: 'licences',
    cursor: 'licence_id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.licences.findMany({ ...query })
  })
)