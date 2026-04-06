// // import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// // import { PrismaClient } from "@/generated/prisma/client";

// // const adapter = new PrismaMariaDb({
// //   host: process.env.DATABASE_HOST,
// //   user: process.env.DATABASE_USER,
// //   password: process.env.DATABASE_PASSWORD,
// //   database: process.env.DATABASE_NAME,
// //   port: Number(process.env.DATABASE_PORT),
// // });
// // const prisma = new PrismaClient({ adapter });
// // export { prisma };

// import { PrismaMariaDb } from "@prisma/adapter-mariadb";
// import { PrismaClient } from "../../generated/prisma/client";

// const globalForPrisma = globalThis as any;

// const adapter = new PrismaMariaDb({
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: Number(process.env.DATABASE_PORT),
//   connectionLimit: 10,
//   acquireTimeout: 30000,
// });

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({ adapter });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

import { PrismaClient } from "@/generated/prisma/client";

const prisma = new PrismaClient();
export { prisma };