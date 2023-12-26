// /graphql/types/User.ts
import { builder } from "../builder";
import dayjs from 'dayjs'

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

builder.mutationField('renewCompanyPackage', (t) =>
  t.prismaField({
    type: 'companies',
    args: {
      id: t.arg.id({ required: true }),
      manualExpireDate: t.arg.string(),
    },
    resolve: async (query, _parent, args, ctx) => {
      if (!(await ctx).user) {
        throw new Error("You have to be logged in to perform this action")
      }

      const companyId = String(args.id);
      const stampDate = args.manualExpireDate ? dayjs(args.manualExpireDate) : dayjs().add(31, 'day')

      // Update the company
      const updatedCompany = await prisma.companies.update({
        ...query,
        where: {
          Id: companyId
        },
        data: {
          // Update the company fields here
          expire_date: stampDate.add(30, 'day').toISOString(),
          end_package: stampDate.toISOString()
        }
      });

      // Update the licenses
      const updatedLicenses = await prisma.licences.updateMany({
        where: {
          companyId
        },
        data: {
          licence_expire: stampDate.toISOString()
        }
      });

      return updatedCompany;
    }
  })
)