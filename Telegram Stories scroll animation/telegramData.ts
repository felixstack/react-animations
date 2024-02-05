import { faker } from '@faker-js/faker';

faker.seed(2)


const dataLength = 50;
const hasStories = faker.helpers.arrayElements([...Array(dataLength).keys()], 12)
const telegramData = Array.from({ length: dataLength }).map((_, index) => ({
  key: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: faker.image.avatarGitHub(),
  date: faker.date.past({
    years: 1
  }),
  message: faker.lorem.sentence({min: 7, max: 15}),
  hasStories: hasStories.includes(index),
  bg: faker.color.rgb()
}))

export const myStory = {
  key: faker.string.uuid(),
  name: faker.person.fullName(),
  avatar: faker.image.avatarLegacy(),
  date: faker.date.past({
    years: 1
  }),
  message: faker.lorem.sentence({min: 7, max: 15}),
  bg: faker.color.rgb(),
  hasStories: false
}

export default telegramData;
