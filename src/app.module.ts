import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PostsModule } from './posts/posts.module';
import { MediasModule } from './medias/medias.module';
import { PublicationsModule } from './publications/publications.module';

@Module({
  imports: [PrismaModule, PostsModule, MediasModule, PublicationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
