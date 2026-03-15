import { int, mysqlTable, serial, varchar, json, date } from 'drizzle-orm/mysql-core';
import { VisualizerAction } from '../admin/visual/create/tools';

export type heading = {
  id: string;
  type: string;
  content: string;
}

export type subHeading = {
  id: string;
  type: string;
  content: string;
}

export type paragraph = {
  id: string;
  type: string;
  content: string;
}

type code = {
  lang: string;
  code: string;
}

type codeBlock = {
  id: string;
  type: string;
  languages: code[];
}

export type highlight = {
  id: string;
  type: string;
  content: string;
}

export type Mixed = heading | subHeading | paragraph | codeBlock | highlight | null;

export type SubTopic = {
  id: string;
  name: string;
  description?: string;
  difficulty: "Easy" | "Normal" | "Hard";
  external_video?: string;
}

export const usersTable = mysqlTable('users_table', {
  id: varchar({ length: 40 }).primaryKey(),
  username: varchar({ length: 255 }).notNull(),
  password: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  role: varchar({ length: 50 }).notNull().default('user'),
});

export const tutorialsTable = mysqlTable('tutorials_table', {
  id: varchar({ length: 40 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  authorId: varchar({ length: 255 }).notNull().references(() => usersTable.id),
})

export const subtopicTable = mysqlTable('subtopic_table', {
  id: varchar({ length: 40 }).primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  description: varchar({ length: 255 }),
  difficulty: varchar({ length: 255 }).notNull().default("Easy"),
  external_video: varchar({ length: 255 })
})

export const tutorialSubtopicsTable = mysqlTable("tutorial_subtopics", {
  tutorialId: varchar({ length: 40 }).notNull().references(() => tutorialsTable.id),
  subtopicId: varchar({ length: 40 }).notNull().references(() => subtopicTable.id),
});

export const topicstable = mysqlTable("topics_table", {
  id: varchar({ length: 40 }).primaryKey(),
  title: varchar({ length: 255 }),
  content: json().$type<Mixed[]>(),
  tutorial_id: varchar({ length: 40 }).notNull().references(() => tutorialsTable.id),
})

export const commentsTable = mysqlTable("comments_table", {
  id: varchar({ length: 40 }).primaryKey(),
  topic_id: varchar({ length: 40 }).notNull().references(() => topicstable.id),
  username: varchar({ length: 100 }).notNull(),
  message: varchar({ length: 500 }).notNull(),
  time: date({ mode: 'date' })
})

export const algoVisualsTable = mysqlTable('algoVisuals_table', {
  id: varchar({ length: 40 }).primaryKey(),
  subtopic_id: varchar({ length: 40 }).references(() => subtopicTable.id),
  code_text: varchar({length: 500}).notNull(),
  code_steps: json().$type<VisualizerAction[]>().notNull(),
  input_array: varchar({length: 30}).notNull()
})