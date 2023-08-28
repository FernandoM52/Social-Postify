import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, Put, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { CreateOrUpdatePublicationDto } from './dto/create-publication.dto';
import { PublicationsService } from './publications.service';

@Controller("publications")
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) { }

  @Post()
  create(@Body() createPublicationDto: CreateOrUpdatePublicationDto) {
    return this.publicationsService.create(createPublicationDto);
  }

  @Get()
  findAll(
    @Query('published') published: boolean | null,
    @Query('after') after: string | null
  ) {
    return this.publicationsService.findAll(published, after);
  }

  @Get(":id")
  findOnePublication(@Param("id", ParseIntPipe) id: number) {
    return this.publicationsService.findOnePublication(+id);
  }

  @Put(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  update(@Param("id", ParseIntPipe) id: number, @Body() updatePublicationDto: CreateOrUpdatePublicationDto) {
    return this.publicationsService.update(+id, updatePublicationDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param("id", ParseIntPipe) id: number) {
    return this.publicationsService.remove(+id);
  }
}
