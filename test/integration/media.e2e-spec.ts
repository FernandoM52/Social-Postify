import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { E2EUtils } from "../helpers/cleanDb";
import { faker } from "@faker-js/faker";
import { MediaFactory } from "../factories/media-factory";

describe('MediaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: request.SuperTest<request.Test>;
  let mediaFactory: MediaFactory = new MediaFactory();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(prisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    prisma = await moduleFixture.resolve(PrismaService);

    await app.init();
    server = request(app.getHttpServer());

    const { cleanDb } = new E2EUtils();
    await cleanDb(prisma);
  });

  describe("POST /medias", () => {
    describe("When body is invalid", () => {
      it("Should not create a media and return status code 400", async () => {
        const { statusCode } = await server.post("/medias").send({
          title: "", username: ""
        });

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe("When body is valid", () => {
      it("Should create a media and return the media created with status code 201", async () => {
        const { statusCode, body } = await server.post("/medias").send({
          title: faker.internet.url(),
          username: faker.internet.userName()
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String)
          })
        );
      });
    });
  });

  describe("GET /medias", () => {
    it("Should return a empty array when there are not post created", async () => {
      const { statusCode, body } = await server.get("/medias");

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });

    it("Should return a array of medias when there are already medias created", async () => {
      for (let i = 0; i < 4; i++) await mediaFactory.createMedia(prisma);
      const { statusCode, body } = await server.get("/medias");

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(4);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            username: expect.any(String)
          })
        ])
      );
    });
  });

  describe("GET /medias:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.get(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("Should return status code 404 when id does not exist", async () => {
      const id = faker.number.int({ min: 10000, max: 1200000 });
      const { statusCode } = await server.get(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("Should return a media object respecting the id", async () => {
      const { id, title, username } = await mediaFactory.createMedia(prisma);
      const { statusCode, body } = await server.get(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({ id, title, username, })
      );
    });
  });

  describe("PUT /medias:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.put(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    describe("When body is invalid", () => {
      it("Should return status code 400", async () => {
        const { id } = await mediaFactory.createMedia(prisma);
        const { statusCode } = await server.put(`/medias/${id}`).send({
          title: "", username: ""
        })

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      })
    })

    describe("When body is valid", () => {
      it("Should return status code 404 when id does not exist", async () => {
        const id = faker.number.int({ min: 10000, max: 1200000 });
        const { statusCode } = await server.put(`/medias/${id}`).send({
          title: faker.internet.url(),
          username: faker.internet.userName()
        });

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it("Should update the media respecting the id and return status code 200", async () => {
        const { id } = await mediaFactory.createMedia(prisma);
        const title = faker.internet.url();
        const username = faker.internet.userName();

        const { statusCode } = await server.put(`/medias/${id}`).send({ title, username });
        const media = await mediaFactory.getMediaById(prisma, id);

        expect(statusCode).toBe(HttpStatus.OK);
        expect(media).toEqual(
          expect.objectContaining({
            id,
            title: media.title,
            username: media.username
          })
        );
      });
    })
  });

  describe("DELETE /medias:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.delete(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("Should return status code 404 when id does not exist", async () => {
      const id = faker.number.int({ min: 10000, max: 1200000 });
      const { statusCode } = await server.delete(`/medias/${id}`);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("Should delete the media respecting the id", async () => {
      const { id } = await mediaFactory.createMedia(prisma);
      const { statusCode } = await server.delete(`/medias/${id}`)

      expect(statusCode).toBe(HttpStatus.OK);
    });
  });
});