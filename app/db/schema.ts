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

type Mixed = heading | subHeading | paragraph | codeBlock | highlight;

export const usersTable = mysqlTable('users_table', {
  id: serial().primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 50 }).notNull().default('user'),
});

export const tutorialsTable = mysqlTable('tutorials_table', {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  subtopic: json().$type<string[]>(),
  authorId: varchar({ length: 255 }).notNull().references(() => usersTable.id),
})

export const topicstable = mysqlTable("topics_table", {
  id: serial().primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  content: json().$type<Mixed[]>(),
  tutorial_id: int().notNull().references(() => tutorialsTable.id),
})