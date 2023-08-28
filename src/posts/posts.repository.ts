import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateOrUpdatePostDto } from "./dto/create-post.dto";

@Injectable()
export class PostsRepository {
  constructor(private readonly prisma: PrismaService) { }

  async createPost(body: CreateOrUpdatePostDto) {
    return await this.prisma.posts.create({ data: body });
  }

  async findAll() {
    return await this.prisma.posts.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.posts.findUnique({ where: { id } })
  }

  async update(id: number, body: CreateOrUpdatePostDto) {
    return await this.prisma.posts.update({
      data: body,
      where: { id }
    })
  }

  async remove(id: number) {
    return await this.prisma.posts.delete({
      where: {
        id,
        AND: {
          Publications: {
            none: {}
          }
        }
      }
    })
  }
}