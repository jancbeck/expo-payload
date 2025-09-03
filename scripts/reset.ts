import type { DrizzleAdapter } from '@payloadcms/drizzle/dist/types';
import type { Payload } from 'payload';

export async function resetDB(_payload: Payload) {
  if ('drizzle' in _payload.db) {
    const db = _payload.db as unknown as DrizzleAdapter;

    // Alternative to: await db.drizzle.execute(sql`drop schema public cascade; create schema public;`)

    // Deleting the schema causes issues when restoring the database from a snapshot later on. That's why we only delete the table data here,
    // To avoid having to re-create any table schemas / indexes / whatever
    const schema = db.drizzle._.schema;
    if (!schema) {
      return;
    }

    const queries = Object.values(schema)
      .map((table: any) => {
        return `DELETE FROM ${db.schemaName ? db.schemaName + '.' : ''}${table.dbName};`;
      })
      .join('');

    await db.execute({
      drizzle: db.drizzle,
      raw: queries,
    });
  }
}
