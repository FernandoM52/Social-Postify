import { Module, forwardRef } from "@nestjs/common";
import { PublicationsController } from "./publications.controller";
import { PublicationsRepository } from "./publications.repository";
import { PublicationsService } from "./publications.service";
import { MediasModule } from "../medias/medias.module";
import { PostsModule } from "../posts/posts.module";

@Module({
  imports: [forwardRef(() => MediasModule), forwardRef(() => PostsModule)],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  exports: [PublicationsService]
})
export class PublicationsModule { }
