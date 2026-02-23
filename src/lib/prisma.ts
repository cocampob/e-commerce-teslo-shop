import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = `${process.env.DATABASE_URL}`

const adapter = new PrismaPg({ connectionString })
const prisma = new PrismaClient({ adapter })

export default prisma 





// import "dotenv/config";
// import { PrismaClient } from '../../src/generated/prisma/client'
// import { PrismaPg } from '@prisma/adapter-pg'


// let prisma: PrismaClient;
// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL })

// if (process.env.DATABASE_URL=== 'production') {
//   prisma = new PrismaClient({adapter });
// } else {
//   if (!(global as any).prisma) {
//     (global as any).prisma = new PrismaClient({ adapter });
//   }
//   prisma = (global as any).prisma;
// }

// export default prisma;

