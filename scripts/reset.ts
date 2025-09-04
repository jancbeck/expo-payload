import configPromise from '@payload-config';
import { getPayload } from 'payload';
import { sql } from 'drizzle-orm';

export async function resetDB() {
  console.log('Resetting database');

  const payload = await getPayload({ config: configPromise });
  try {
    await payload.db.drizzle.execute(
      sql`drop schema public cascade; create schema public;`,
    );
    console.log('Database reset.');
  } catch (error) {
    console.error('Failed to reset database', error);
  } finally {
    process.exit();
  }
}

resetDB();
