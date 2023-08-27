import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { CreateOrUpdateMediaDto } from "./dto/create-media.dto";
import { MediasRepository } from "./medias.repository";
import { PublicationsService } from "../publications/publications.service";
import * as mediaError from "../errors/medias";

@Injectable()
export class MediasService {
  constructor(
    private readonly mediasRepository: MediasRepository,
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationsService: PublicationsService
  ) { }

  async createMedia(body: CreateOrUpdateMediaDto) {
    const { title, username } = body;
    await this.verifyUsernameExistOnMedia(title, username);

    return await this.mediasRepository.createMedia(title, username);
  }

  async findAllMedias() {
    return await this.mediasRepository.findAllMedias();
  }

  async findOneMedia(id: number) {
    const media = await this.verifyMediaExist(id);
    return media;
  }

  async updateMedia(id: number, updateMediaDto: CreateOrUpdateMediaDto) {
    await this.verifyMediaExist(id);

    const { title, username } = updateMediaDto;
    await this.verifyUsernameExistOnMedia(title, username);

    return this.mediasRepository.updateMedia(id, title, username);
  }

  async removeMedia(id: number) {
    const media = await this.verifyMediaExist(id);

    const mediaHasPublication = await this.publicationsService.findPublicationByMediaId(media.id);
    if (mediaHasPublication) throw new mediaError.ForbiddenMediaDeletion(media.title);

    await this.mediasRepository.deleteOneMedia(id);
  }

  async verifyMediaExist(id: number) {
    const media = await this.mediasRepository.findOneMedia(id);
    if (!media) throw new mediaError.MediaNotFound(id);

    return media;
  }

  async verifyUsernameExistOnMedia(title: string, username: string) {
    const usernameExistOnMedia = await this.mediasRepository.findUserByMedia(title, username);
    if (usernameExistOnMedia) throw new mediaError.MediaUsernameConflict(title, username);

    return usernameExistOnMedia;
  }
}
