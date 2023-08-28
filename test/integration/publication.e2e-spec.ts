import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { E2EUtils } from "../helpers/cleanDb";
import { faker } from "@faker-js/faker";
import { PublicationFactory } from "../factories/publication-factory";
import { MediaFactory } from "../factories/media-factory";
import { PostFactory } from "../factories/post-factory copy";

describe('MediaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: request.SuperTest<request.Test>;
  let publicationFactory: PublicationFactory = new PublicationFactory();
  let mediaFactory: MediaFactory = new MediaFactory();
  let postFactory: PostFactory = new PostFactory();

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

  describe("POST /publications", () => {
    describe("When body is invalid", () => {
      it("Should not create a post and return status code 400", async () => {
        const { statusCode } = await server.post("/publications").send({
          mediaId: "", postId: "", date: ""
        });

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe("When body is valid", () => {
      it("When field 'mediaId' or 'postId' does not exist should return status code 404", async () => {
        const { statusCode } = await server.post("/publications").send({
          mediaId: faker.number.int({ min: 5000, max: 10000 }),
          postId: faker.number.int({ min: 5000, max: 10000 }),
          date: faker.date.soon({ refDate: new Date() })
        });

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it("Should create a publication and return it with status code 201", async () => {
        const media = await mediaFactory.createMedia(prisma);
        const post = await postFactory.createPost(prisma);

        const { statusCode, body } = await server.post("/publications").send({
          mediaId: media.id,
          postId: post.id,
          date: faker.date.soon({ refDate: new Date() })
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          })
        );
      });
    });
  });

  describe("GET /publications", () => {
    it("Should return a empty array when there are not publications created", async () => {
      const { statusCode, body } = await server.get("/publications");

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });

    it("Should return a array of publications when there are already publications created", async () => {
      const media1 = await mediaFactory.createMedia(prisma);
      const media2 = await mediaFactory.createMedia(prisma);
      const media3 = await mediaFactory.createMedia(prisma);
      const post1 = await postFactory.createPost(prisma);
      const post2 = await postFactory.createPost(prisma);
      const post3 = await postFactory.createPost(prisma);
      await publicationFactory.createPublication(prisma, media1.id, post1.id);
      await publicationFactory.createPublication(prisma, media2.id, post2.id);
      await publicationFactory.createPublication(prisma, media3.id, post3.id);

      const { statusCode, body } = await server.get("/publications");

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(3);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            mediaId: expect.any(Number),
            postId: expect.any(Number),
            date: expect.any(String),
          })
        ])
      );
    });
  });

  describe("GET /publications:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.get(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("Should return status code 404 when id does not exist", async () => {
      const id = faker.number.int({ min: 10000, max: 1200000 });
      const { statusCode } = await server.get(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("Should return a publication object respecting the id", async () => {
      const media = await mediaFactory.createMedia(prisma);
      const post = await postFactory.createPost(prisma);
      const publication = await publicationFactory.createPublication(prisma, media.id, post.id);

      const { statusCode, body } = await server.get(`/publications/${publication.id}`);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          id: publication.id,
          mediaId: publication.mediaId,
          postId: publication.postId,
          date: expect.any(String)
        })
      );
    });
  });

  describe("PUT /publications:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.put(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    describe("When body is invalid", () => {
      it("Should return status code 400", async () => {
        const media = await mediaFactory.createMedia(prisma);
        const post = await postFactory.createPost(prisma);
        const { id } = await publicationFactory.createPublication(prisma, media.id, post.id);

        const { statusCode } = await server.put(`/publications/${id}`).send({
          mediaId: "", postId: "", date: ""
        })

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      })
    })

    describe("When body is valid", () => {
      it("Should return status code 404 when id does not exist", async () => {
        const id = faker.number.int({ min: 10000, max: 1200000 });
        const media = await mediaFactory.createMedia(prisma);
        const post = await postFactory.createPost(prisma);

        const { statusCode } = await server.put(`/publications/${id}`).send({
          mediaId: media.id,
          postId: post.id,
          date: faker.date.soon({ refDate: new Date() })
        });

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it("Should update the publication respecting the id and return status code 204", async () => {
        const media = await mediaFactory.createMedia(prisma);
        const post = await postFactory.createPost(prisma);
        const { id } = await publicationFactory.createPublication(prisma, media.id, post.id);

        const { statusCode } = await server.put(`/publications/${id}`).send({
          mediaId: media.id,
          postId: post.id,
          date: faker.date.soon({ days: 10, refDate: new Date() })
        });

        const publication = await publicationFactory.getMediaById(prisma, id);

        expect(statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(publication).toEqual(
          expect.objectContaining({
            id,
            mediaId: publication.mediaId,
            postId: publication.postId,
            date: publication.date
          })
        );
      });
    })
  });

  describe("DELETE /publications:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.delete(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("Should return status code 404 when id does not exist", async () => {
      const id = faker.number.int({ min: 10000, max: 1200000 });
      const { statusCode } = await server.delete(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("Should delete the media respecting the id and return status code 204", async () => {
      const media = await mediaFactory.createMedia(prisma);
      const post = await postFactory.createPost(prisma);
      const { id } = await publicationFactory.createPublication(prisma, media.id, post.id);

      const { statusCode } = await server.delete(`/publications/${id}`);

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
    });
  });
});