import { mysqlTable, varchar, json, date, datetime } from 'drizzle-orm/mysql-core';
import { VisualizerAction } from '../admin/visual/create/tools';
import { array } from 'zod';

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
  dateJoined: datetime().notNull().default(new Date(Date.now()))
});

export const tutorialsTable = mysqlTable('tutorials_table', {
  id: varchar({ length: 40 }).primaryKey(),
  title: varchar({ length: 255 }).notNull(),
  authorId: varchar({ length: 255 }).notNull().references(() => usersTable.id),
  type: varchar({ length: 20 }).notNull().default('algorithm')
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

export const algoVisualsTable = mysqlTable('algovisuals_table', {
  id: varchar({ length: 40 }).primaryKey(),
  subtopic_id: varchar({ length: 40 }).references(() => subtopicTable.id),
  code_text: varchar({ length: 500 }).notNull(),
  code_steps: json().$type<VisualizerAction[]>().notNull(),
  input_array: varchar({ length: 30 }).notNull()
})

export const setTable = mysqlTable('set_table', {
  id: varchar({ length: 40 }).primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  author_id: varchar({ length: 40 }).notNull().references(() => usersTable.id),
})

export const problemTable = mysqlTable('problem_table', {
  id: varchar({ length: 40 }).primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  link: varchar({ length: 100 }).notNull(),
  difficulty: varchar({ length: 10 }).notNull().default("Easy"),
  video_link: varchar({ length: 100 }),
  set_id: varchar({ length: 40 }).notNull().references(() => setTable.id),
  author_id: varchar({ length: 40 }).notNull().references(() => usersTable.id),
  hints: json().$type<string[]>()
})

export const setProblemTable = mysqlTable('set_problem', {
  id: varchar({ length: 40 }).primaryKey(),
  set_id: varchar({length: 40}).notNull().references(() => setTable.id),
  problem_id: varchar({length: 40}).notNull().references(() => problemTable.id).unique(),
})

export const problemDescriptionTable = mysqlTable('problem_description', {
  id: varchar({ length: 40 }).primaryKey(),
  title: varchar({ length: 255 }),
  content: json().$type<Mixed[]>(),
  problem_id: varchar({ length: 40 }).notNull().references(() => problemTable.id).unique()
})

export const problemVisualsTable = mysqlTable('problem_visuals', {
  id: varchar({ length: 40 }).primaryKey(),
  problem_id: varchar({ length: 40 }).notNull().references(() => problemTable.id).unique(),
  code_text: varchar({ length: 500 }).notNull(),
  code_steps: json().$type<VisualizerAction[]>().notNull(),
  input_array: varchar({ length: 500 }).notNull()
})