// /graphql/types/User.ts
import { builder } from "../builder";

builder.prismaObject('users', {
  fields: (t) => ({
    id: t.exposeID('Id'),
    email: t.exposeString('email', { nullable: false, }),
    image: t.exposeString('image', { nullable: true, }),
    companyId: t.exposeString('companyId', { nullable: true, }),
    firstName: t.exposeString('firstName', { nullable: true, }),
    lastName: t.exposeString('lastName', { nullable: true, }),
    status: t.exposeInt('status', { nullable: false, }),
    usageSize: t.exposeFloat('size', { nullable: false, }),
    storeSize: t.exposeFloat('size_cont', { nullable: true, }),
    updatedAt: t.expose('updated_at', {type: "Date", nullable: true}),
    createdAt: t.expose('created_at', {type: "Date", nullable: true}),
  })
})

builder.queryField('users', (t) =>
  t.prismaConnection({
    type: 'users',
    cursor: 'Id',
    resolve: (query, _parent, _args, _ctx, _info) =>
      prisma.users.findMany({ ...query, where: { status: 1}, orderBy: { 'updated_at': 'desc' }})
  })
)

// builder.queryField('users', (t) =>
//   t.prismaField({
//     type: 'users',
//     resolve: async (query, _parent, _args, ctx) => {
//       if (!(await ctx).user) {
//         throw new Error("You have to be logged in to perform this action")
//       }

//       const user = await prisma.users.findUnique({
//         ...query,
//         where: {
//           Id: (await ctx).user?.Id,
//         }
//       })

//       if (!user) throw Error('User does not exist');

//       return user
//     }
//   })
// )