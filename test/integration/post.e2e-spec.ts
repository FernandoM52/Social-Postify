import { Test, TestingModule } from "@nestjs/testing";
import { HttpStatus, INestApplication, ValidationPipe } from "@nestjs/common";
import * as request from "supertest";
import { AppModule } from "../../src/app.module";
import { PrismaService } from "../../src/prisma/prisma.service";
import { E2EUtils } from "../helpers/cleanDb";
import { faker } from "@faker-js/faker";
import { PostFactory } from "../factories/post-factory copy";

describe('MediaController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();
  let server: request.SuperTest<request.Test>;
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

  describe("POST /posts", () => {
    describe("When body is invalid", () => {
      it("Should not create a post and return status code 400", async () => {
        const { statusCode } = await server.post("/posts").send({
          title: "", text: "", image: ""
        });

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      });
    });

    describe("When body is valid", () => {
      it("When body does not have field 'image', should create a post and return it with status code 201", async () => {
        const { statusCode, body } = await server.post("/posts").send({
          title: faker.lorem.sentence({ min: 3, max: 6 }),
          text: faker.internet.url()
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String)
          })
        );
      });

      it("When body have field 'image', should create a post and return it with status code 201", async () => {
        const { statusCode, body } = await server.post("/posts").send({
          title: faker.lorem.sentence({ min: 3, max: 6 }),
          text: faker.internet.url(),
          image: faker.image.url()
        });

        expect(statusCode).toBe(HttpStatus.CREATED);
        expect(body).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String),
            image: expect.any(String)
          })
        );
      });
    });
  });

  describe("GET /posts", () => {
    it("Should return a empty array when there are not post created", async () => {
      const { statusCode, body } = await server.get("/posts");

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual([]);
    });

    it("Should return a array of posts when there are already posts created", async () => {
      for (let i = 0; i < 3; i++) await postFactory.createPost(prisma, (i <= 2));
      const { statusCode, body } = await server.get("/posts");

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toHaveLength(3);
      expect(body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            title: expect.any(String),
            text: expect.any(String),
            image: expect.any(String)
          })
        ])
      );
    });
  });

  describe("GET /posts:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.get(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("Should return status code 404 when id does not exist", async () => {
      const id = faker.number.int({ min: 10000, max: 1200000 });
      const { statusCode } = await server.get(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("Should return a media object respecting the id", async () => {
      const post = await postFactory.createPost(prisma);
      const { statusCode, body } = await server.get(`/posts/${post.id}`);

      expect(statusCode).toBe(HttpStatus.OK);
      expect(body).toEqual(
        expect.objectContaining({
          id: post.id,
          title: post.title,
          text: post.text,
          image: post.image
        })
      );
    });
  });

  describe("PUT /posts:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.put(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    describe("When body is invalid", () => {
      it("Should return status code 400", async () => {
        const { id } = await postFactory.createPost(prisma);
        const { statusCode } = await server.put(`/posts/${id}`).send({
          title: "", text: "", image: ""
        })

        expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
      })
    })

    describe("When body is valid", () => {
      it("Should return status code 404 when id does not exist", async () => {
        const id = faker.number.int({ min: 10000, max: 1200000 });
        const { statusCode } = await server.put(`/posts/${id}`).send({
          title: faker.lorem.sentence({ min: 3, max: 6 }),
          text: faker.internet.url(),
        });

        expect(statusCode).toBe(HttpStatus.NOT_FOUND);
      });

      it("Should update the media respecting the id and return status code 204", async () => {
        const { id } = await postFactory.createPost(prisma);
        const title = faker.internet.url();
        const text = faker.internet.userName();

        const { statusCode } = await server.put(`/posts/${id}`).send({ title, text });
        const post = await postFactory.getPostById(prisma, id);

        expect(statusCode).toBe(HttpStatus.NO_CONTENT);
        expect(post).toEqual(
          expect.objectContaining({
            id,
            title: post.title,
            text: post.text,
            image: post.image
          })
        );
      });
    })
  });

  describe("DELETE /posts:id", () => {
    it("Should return status code 400 when id is invalid format", async () => {
      const id = faker.person.firstName();
      const { statusCode } = await server.delete(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it("Should return status code 404 when id does not exist", async () => {
      const id = faker.number.int({ min: 10000, max: 1200000 });
      const { statusCode } = await server.delete(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.NOT_FOUND);
    });

    it("Should delete the media respecting the id and return status code 204", async () => {
      const { id } = await postFactory.createPost(prisma);
      const { statusCode } = await server.delete(`/posts/${id}`);

      expect(statusCode).toBe(HttpStatus.NO_CONTENT);
    });
  });
});