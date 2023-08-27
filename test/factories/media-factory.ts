import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class MediaFactory {
  async createMedia(prisma: PrismaService) {
    return await prisma.medias.create({
      data: {
        title: faker.internet.url(),
        username: faker.internet.userName()
      }
    });
  }

  async getMediaById(prisma: PrismaService, id: number) {
    return await prisma.medias.findUnique({ where: { id } });
  }
}