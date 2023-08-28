import { PrismaService } from "../../src/prisma/prisma.service";
import { faker } from "@faker-js/faker";

export class PostFactory {
  async createPost(prisma: PrismaService, image = false) {
    return await prisma.posts.create({
      data: {
        title: faker.lorem.sentence({ min: 3, max: 6 }),
        text: faker.internet.url(),
        image: image ? faker.image.url() : null
      }
    });
  }

  async getPostById(prisma: PrismaService, id: number) {
    return await prisma.posts.findUnique({
      where: { id }
    })
  }
}