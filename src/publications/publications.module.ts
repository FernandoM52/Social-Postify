import { Module, forwardRef } from "@nestjs/common";
import { PublicationsController } from "./publications.controller";
import { PublicationsRepository } from "./publications.repository";
import { PublicationsService } from "./publications.service";
import { MediasModule } from "../medias/medias.module";

@Module({
  imports: [forwardRef(() => MediasModule)],
  controllers: [PublicationsController],
  providers: [PublicationsService, PublicationsRepository],
  exports: [PublicationsService]
})
export class PublicationsModule { }
