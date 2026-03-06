import { int, mysqlTable, serial, varchar, json } from 'drizzle-orm/mysql-core';

type heading = {
  type: string;
  content: string;
}

type subHeading = {
  type: string;
  content: string;
}

type paragraph = {
  type: string;
  content: string;
}

type code = {
  language: string;
  code: string;
}

type codeBlock = {
  type: string;
  content: code[];
}

type highlight = {
  type: string;
  content: string;
}

export type Mixed = heading | subHeading | paragraph | codeBlock | highlight | null;

export const usersTable = mysqlTable('users_table', {
  id: varchar({length: 40}).primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 50 }).notNull().default('user'),
});

export const tutorialsTable = mysqlTable('tutorials_table', {
  id: varchar({length: 40}).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  subtopic: json().$type<string[]>(),
  authorId: varchar({ length: 255 }).notNull().references(() => usersTable.id),
})

export const topicstable = mysqlTable("topics_table", {
  id: varchar({length: 40}).primaryKey(),
  title: varchar({ length: 255 }),
  content: json().$type<Mixed[]>(),
  tutorial_id: varchar({length: 40}).notNull().references(() => tutorialsTable.id),
})