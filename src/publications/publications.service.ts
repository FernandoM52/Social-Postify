import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsRepository } from './publications.repository';
import { MediasService } from '../medias/medias.service';

@Injectable()
export class PublicationsService {
  constructor(
    @Inject(forwardRef(() => MediasService))
    private mediasService: MediasService,
    private publicationsRepository: PublicationsRepository,
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

  findPublicationByMediaId(mediaId: number) {
    return this.publicationsRepository.findPublicationByMediaId(mediaId);
  }

  update(id: number, updatePublicationDto: UpdatePublicationDto) {
    return `This action updates a #${id} publication`;
  }

  remove(id: number) {
    return `This action removes a #${id} publication`;
  }
}
