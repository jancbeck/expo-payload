import { getPayload } from 'payload';
import config from '@payload-config';

import { parseArgs } from 'util';
import { resetDB } from './reset';

async function run() {
  const payload = await getPayload({ config });

  const {
    values: { email, password },
  } = parseArgs({
    args: Bun.argv,
    options: {
      email: {
        type: 'string',
      },
      password: {
        type: 'string',
      },
    },
    strict: true,
    allowPositionals: true,
  });

  try {
    await resetDB(payload);

    payload.logger.info('Seeding database...');

    if (email && password) {
      payload.logger.info('Creating admin account...');
      await payload.create<'admins'>({
        collection: 'admins',
        data: { email, password },
      });
    }

    payload.logger.info('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    payload.logger.info(error, 'Failed to seed database');
    process.exit(1);
  }
}

void run();
