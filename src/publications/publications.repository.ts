import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrUpdatePublicationDto } from "./dto/create-publication.dto";

@Injectable()
export class PublicationsRepository {
  constructor(private prisma: PrismaService) { }

  async create(createPublicationDto: CreateOrUpdatePublicationDto) {
    return await this.prisma.publications.create({ data: createPublicationDto });
  }

  async findAll(published: boolean | null, after: string | null) {
    const currentDate = new Date();
    return await this.prisma.publications.findMany({
      where: {
        date: {
          lt: published ? currentDate : undefined
        },
        AND: {
          date: {
            gte: after ? new Date(after) : undefined
          }
        }
      }
    });
  }

  async findOne(id: number) {
    return await this.prisma.publications.findUnique({ where: { id } });
  }

  async update(id: number, updatePublicationDto: CreateOrUpdatePublicationDto) {
    return await this.prisma.publications.update({
      data: updatePublicationDto,
      where: { id }
    });
  }

  async remove(id: number) {
    return await this.prisma.publications.delete({ where: { id } });
  }

  async findPublicationByMediaId(mediaId: number) {
    return await this.prisma.publications.findFirst({ where: { mediaId } });
  }

  async findPublicationByPostId(postId: number) {
    return await this.prisma.publications.findFirst({ where: { postId } });
  }

}