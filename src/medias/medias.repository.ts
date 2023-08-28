import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MediasRepository {

  constructor(private readonly prisma: PrismaService) { }

  async createMedia(title: string, username: string) {
    return await this.prisma.medias.create({
      data: {
        title,
        username
      }
    });
  }

  async findUserByMedia(title: string, username: string) {
    return await this.prisma.medias.findFirst({
      where: {
        AND: [
          { title },
          { username }
        ]
      }
    });
  }

  async findAllMedias() {
    return await this.prisma.medias.findMany();
  }

  async findOneMedia(id: number) {
    return await this.prisma.medias.findUnique({
      where: { id }
    });
  }

  async updateMedia(id: number, title: string, username: string) {
    return await this.prisma.medias.update({
      data: { title, username },
      where: { id },
      select: { title: true, username: true }
    });
  }

  async deleteOneMedia(id: number) {
    return await this.prisma.medias.delete({
      where: {
        id,
        AND: {
          publications: {
            none: {}
          }
        }
      }
    });
  }
}