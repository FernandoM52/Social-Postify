import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaModule } from '../src/prisma/prisma.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, PrismaModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    prisma = await moduleFixture.resolve(PrismaService);
    //TODO: fazer função cleanDB para limpar o banco de testes antes de cada execução

    await app.init();
    server = app.getHttpServer();
  });

  it('/ (GET)', () => {
    return request(server)
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
