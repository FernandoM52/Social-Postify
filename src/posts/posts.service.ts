import { ForbiddenException, Inject, Injectable, NotFoundException, forwardRef } from '@nestjs/common';
import { CreateOrUpdatePostDto } from './dto/create-post.dto';
import { PostsRepository } from './posts.repository';
import { PublicationsService } from '../publications/publications.service';

@Injectable()
export class PostsService {
  constructor(
    private readonly postsRepository: PostsRepository,
    @Inject(forwardRef(() => PublicationsService))
    private readonly publicationsService: PublicationsService
  ) { }

  createPost(body: CreateOrUpdatePostDto) {
    return this.postsRepository.createPost(body);
  }

  findAll() {
    return this.postsRepository.findAll();
  }

  async findOne(id: number) {
    const post = await this.verifyPostExist(id);
    return post;
  }

  async update(id: number, body: CreateOrUpdatePostDto) {
    await this.verifyPostExist(id);
    return this.postsRepository.update(id, body);
  }

  async remove(id: number) {
    const post = await this.verifyPostExist(id);

    const postHasPublication = await this.publicationsService.findPublicationByPostId(post.id)
    if (postHasPublication) throw new ForbiddenException(`Cannot delete post with id ${post.id}, there is a publication associated with it`);

    await this.postsRepository.remove(id);
  }

  async verifyPostExist(id: number) {
    const post = await this.postsRepository.findOne(id);
    if (!post) throw new NotFoundException(`The post with id '${id}' does not exist`);

    return post;
  }
}
