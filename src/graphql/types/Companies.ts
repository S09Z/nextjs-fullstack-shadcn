// /graphql/types/User.ts
import { builder } from "../builder";

// t.field({
//   type: ['Float'], // if its a list, or just `'Float'` if its not a list
//   resolve: (parent) => parent.points
// })

builder.prismaObject('companies', {
  fields: (t) => ({
    id: t.exposeID('Id'),
    companyName: t.exposeString('companyName', { nullable: true, }),
    companyuser: t.exposeInt('companyuser', { nullable: true, }),
    expire_date: t.expose('expire_date', {type: "Date", nullable: true}),
    end_package: t.exposeString('end_package', { nullable: true, }),
  })
})

builder.queryField('companies', (t) =>
  t.prismaConnection({
    type: 'companies',
    cursor: 'Id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.companies.findMany({ 
        ...query,
        take: _args.first as number ?? 1000,
        orderBy: { 'expire_date': 'desc' }
      })
  })
)