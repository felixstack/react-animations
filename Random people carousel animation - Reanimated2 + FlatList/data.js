import icons from './icons';
import { faker } from '@faker-js/faker';

const data = icons.map(icon => ({
  key: faker.datatype.uuid(),
  name: faker.commerce.product(),
  icon
}))

export default data