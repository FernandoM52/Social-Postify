import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class PublicationFactory {
  async createPublication(prisma: PrismaService, mediaId: number, postId: number) {
    return await prisma.publications.create({
      data: {
        mediaId,
        postId,
        date: faker.date.soon({ refDate: new Date() })
      }
    });
  }

  async getMediaById(prisma: PrismaService, id: number) {
    return await prisma.publications.findUnique({ where: { id } });
  }
}