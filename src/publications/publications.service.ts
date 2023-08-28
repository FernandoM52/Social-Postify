import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateOrUpdatePublicationDto } from './dto/create-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from '../medias/medias.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class PublicationsService {
  constructor(
    private readonly publicationsRepository: PublicationsRepository,
    @Inject(forwardRef(() => MediasService))
    private readonly mediasService: MediasService,
    @Inject(forwardRef(() => PostsService))
    private readonly postsService: PostsService,
  ) { }

  async create(createPublicationDto: CreateOrUpdatePublicationDto) {
    await this.mediasService.verifyMediaExist(createPublicationDto.mediaId);
    await this.postsService.verifyPostExist(createPublicationDto.postId);
    return this.publicationsRepository.create(createPublicationDto);
  }

  findAll(published: boolean | null, after: string | null) {
    return this.publicationsRepository.findAll(published, after);
  }

  async findOnePublication(id: number) {
    const publication = await this.verifyPublicationExist(id);
    return publication;
  }


  async update(id: number, updatePublicationDto: CreateOrUpdatePublicationDto) {
    const publication = await this.verifyPublicationExist(id);
    await this.mediasService.verifyMediaExist(updatePublicationDto.mediaId);
    await this.postsService.verifyPostExist(updatePublicationDto.postId);
    await this.verifyPublicationDate(publication.date);

    return this.publicationsRepository.update(id, updatePublicationDto);
  }

  async remove(id: number) {
    await this.verifyPublicationExist(id);
    return this.publicationsRepository.remove(id);
  }

  async verifyPublicationExist(id: number) {
    const publication = await this.publicationsRepository.findOne(id);
    if (!publication) throw new NotFoundException(`The publication with id '${id}' does not exist`);

    return publication;
  }

  async verifyPublicationDate(publicationDate: Date) {
    const currentDate = new Date();
    if (publicationDate.getTime() < currentDate.getTime()) throw new ForbiddenException(`The publication has already been done`)
  }

  findPublicationByMediaId(mediaId: number) {
    return this.publicationsRepository.findPublicationByMediaId(mediaId);
  }

  findPublicationByPostId(postId: number) {
    return this.publicationsRepository.findPublicationByPostId(postId);
  }
}
