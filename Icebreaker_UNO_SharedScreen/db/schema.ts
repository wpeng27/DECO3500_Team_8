import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const sessions=sqliteTable('ice_sessions',{code:text('code').primaryKey(),state:text('state').notNull(),revision:integer('revision').notNull().default(0),expiresAt:integer('expires_at').notNull()},t=>[index('ice_sessions_expiry').on(t.expiresAt)]);
