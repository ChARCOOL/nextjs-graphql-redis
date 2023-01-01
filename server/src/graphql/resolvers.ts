import { GraphQLDateTime } from 'graphql-iso-date';
import GraphQLJSON from 'graphql-type-json';
import { times } from 'lodash';
import db from '../modules/db';
import { enqueue } from '../modules/queue';

const resolvers = {
  DateTime: GraphQLDateTime,
  JSON: GraphQLJSON,

  Query: {
    async submissions() {
      return await db.submission.findMany({ orderBy: { submittedAt: 'desc' } });
    },
  },

  Mutation: {
    async queueSubmissionGeneration(_: any, { count }: { count: number }) {
      await Promise.all(
        times(count || 1).map(async () => {
          await enqueue('generateSubmissions');
        })
      );

      return true;
    },
  },
};

export default resolvers;
