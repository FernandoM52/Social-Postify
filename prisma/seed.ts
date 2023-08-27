import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  await prisma.publications.deleteMany({});
  await prisma.posts.deleteMany({});
  await prisma.medias.deleteMany({});

  // Creating medias
  const randomName = faker.internet.userName({ firstName: "John", lastName: "Doe" });

  const media1 = await prisma.medias.create({
    data: { title: "Instagram", username: randomName },
  });

  const media2 = await prisma.medias.create({
    data: { title: "X", username: randomName },
  });

  const media3 = await prisma.medias.create({
    data: { title: "Facebook", username: randomName },
  });

  // Creating posts
  const post1 = await prisma.posts.create({
    data: {
      title: faker.lorem.sentence({ min: 3, max: 10 }),
      text: faker.internet.url(),
      image: faker.image.url()
    }
  });

  const post2 = await prisma.posts.create({
    data: {
      title: faker.lorem.sentence({ min: 3, max: 10 }),
      text: faker.internet.url(),
    }
  });

  const post3 = await prisma.posts.create({
    data: {
      title: faker.lorem.sentence({ min: 3, max: 10 }),
      text: faker.internet.url(),
    }
  });

  // Creating publications
  await prisma.publications.create({
    data: {
      mediaId: media1.id,
      postId: post1.id,
      date: faker.date.soon()
    }
  });

  await prisma.publications.create({
    data: {
      mediaId: media2.id,
      postId: post2.id,
      date: faker.date.soon()
    }
  });

  await prisma.publications.create({
    data: {
      mediaId: media3.id,
      postId: post3.id,
      date: faker.date.soon()
    }
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });