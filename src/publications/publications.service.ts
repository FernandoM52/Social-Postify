import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
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

  create(createPublicationDto: CreatePublicationDto) {
    return 'This action adds a new publication';
  }

  findAll() {
    return `This action returns all publications`;
  }

  findOnePublication(id: number) {
    return `This action returns a #${id} publication`;
  }


  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }

  findPublicationByMediaId(mediaId: number) {
    return this.publicationsRepository.findPublicationByMediaId(mediaId);
  }

  findPublicationByPostId(postId: number) {
    return this.publicationsRepository.findPublicationByPostId(postId);
  }
}
