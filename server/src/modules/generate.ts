import { faker } from '@faker-js/faker';
import db, { genId } from './db';
import random from 'lodash/random';

const submission = async () => {
  return await db.submission.create({
    data: {
      id: genId(),
      submittedAt: new Date(),
      data: {
        name: faker.name.fullName(),
        email: faker.internet.email(),
        company: faker.company.name(),
        comments: faker.lorem.words(random(30, false)),
      },
    },
  });
};

const ModGenerate = {
  submission,
};

export default ModGenerate;
