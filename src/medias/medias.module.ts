import { Module, forwardRef } from "@nestjs/common";
import { MediasController } from "./medias.controller";
import { MediasRepository } from "./medias.repository";
import { MediasService } from "./medias.service";
import { PublicationsModule } from "../publications/publications.module";

@Module({
  imports: [forwardRef(() => PublicationsModule)],
  controllers: [MediasController],
  providers: [MediasService, MediasRepository],
  exports: [MediasService]
})
export class MediasModule { }
