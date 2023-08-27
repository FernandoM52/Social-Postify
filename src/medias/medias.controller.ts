import { Controller, Get, Post, Body, Param, Delete, Put, ParseIntPipe } from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateOrUpdateMediaDto } from './dto/create-media.dto';

@Controller("medias")
export class MediasController {
  constructor(private readonly mediasService: MediasService) { }

  @Post()
  createMedia(@Body() createMediaDto: CreateOrUpdateMediaDto) {
    return this.mediasService.createMedia(createMediaDto);
  }

  @Get()
  findAllMedias() {
    return this.mediasService.findAllMedias();
  }

  @Get(":id")
  findOneMedia(@Param("id", ParseIntPipe) id: number) {
    return this.mediasService.findOneMedia(+id);
  }

  @Put(":id")
  updateMedia(@Param("id", ParseIntPipe) id: number, @Body() updateMediaDto: CreateOrUpdateMediaDto) {
    return this.mediasService.updateMedia(+id, updateMediaDto);
  }

  @Delete(":id")
  removeMedia(@Param("id", ParseIntPipe) id: number) {
    return this.mediasService.removeMedia(+id);
  }
}
