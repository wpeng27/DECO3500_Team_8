import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const sessions=sqliteTable('ice_sessions',{code:text('code').primaryKey(),state:text('state').notNull(),revision:integer('revision').notNull().default(0),expiresAt:integer('expires_at').notNull()},t=>[index('ice_sessions_expiry').on(t.expiresAt)]);
export const mobileRooms=sqliteTable('mobile_rooms',{
  code:text('code').primaryKey(),hostHash:text('host_hash').notNull(),state:text('state').notNull(),
  revision:integer('revision').notNull().default(0),updatedAt:integer('updated_at').notNull(),expiresAt:integer('expires_at').notNull(),
},t=>[index('mobile_rooms_expiry').on(t.expiresAt)]);
