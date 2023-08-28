import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe, HttpCode, HttpStatus } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreateOrUpdatePostDto } from './dto/create-post.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @Post()
  create(@Body() body: CreateOrUpdatePostDto) {
    return this.postsService.createPost(body);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.findOne(+id);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param('id', ParseIntPipe) id: number, @Body() updatePostDto: CreateOrUpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.remove(+id);
  }
}
