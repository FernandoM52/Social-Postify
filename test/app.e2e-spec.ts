import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "./../src/app.module";
import { PrismaService } from "../src/prisma/prisma.service";

describe("AppController (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let server: request.SuperTest<request.Test>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get(PrismaService);

    await app.init();
    server = request(app.getHttpServer());
  });

  it("/health (GET) => should return correct message", () => {
    return server.get('/health').expect(200).expect('I’m okay!');
  });
});
