import { PrismaService } from "../../src/prisma/prisma.service";

export class E2EUtils {
  async cleanDb(prisma: PrismaService) {
    await prisma.publications.deleteMany({});
    await prisma.medias.deleteMany({});
    await prisma.posts.deleteMany({});
  }
}