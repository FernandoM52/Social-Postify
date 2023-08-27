import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PublicationsRepository {

  constructor(private prisma: PrismaService) { }

  async findPublicationByMediaId(mediaId: number) {
    return await this.prisma.publications.findFirst({
      where: { mediaId }
    });
  }
}