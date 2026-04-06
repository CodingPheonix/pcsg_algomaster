import mongoose from "mongoose";

/* =========================
   SUB-SCHEMAS (if needed)
========================= */

/* =========================
   USERS
========================= */
const users_schema = new mongoose.Schema({
    id: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, default: "user" },
    dateJoined: { type: Date },

    problemIds: [String],
    setIds: [String],
    tutorialIds: [String],

    userProblemId: String
});

/* =========================
   SETS
========================= */
const set_schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    authorId: { type: String, required: true },
    problemIds: [String]
});

/* =========================
   PROBLEMS
========================= */
const problem_schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    link: { type: String, required: true },
    difficulty: { type: String, default: "Easy" },
    video_link: String,

    authorId: { type: String, required: true },
    setId: { type: String, required: true },

    hints: [String],

    descriptionId: String,
    visualsId: String
});

/* =========================
   PROBLEM DESCRIPTION
========================= */
const problem_description_schema = new mongoose.Schema({
    id: { type: String, required: true },

    title: String,
    content: String,

    problemId: { type: String, required: true, unique: true }
});

/* =========================
   PROBLEM VISUALS
========================= */
const problem_visuals_schema = new mongoose.Schema({
    id: { type: String, required: true },

    problemId: { type: String, required: true, unique: true },

    code_text: { type: String, required: true },
    code_steps: { type: String, required: true },
    input_array: { type: String, required: true }
});

/* =========================
   USER PROBLEM
========================= */
const user_problem_schema = new mongoose.Schema({
    id: { type: String, required: true },
    userId: { type: String, required: true, unique: true },
    problemIds: [String]
});

/* =========================
   TUTORIALS
========================= */
const tutorials_schema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, default: "algorithm" },
    authorId: { type: String, required: true },

    subtopicIds: [String]
});

/* =========================
   SUBTOPICS
========================= */
const subtopic_schema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: String,
    difficulty: { type: String, default: "Easy" },
    external_video: String,

    tutorialId: { type: String, required: true },

    topicIds: String,
    algovisualIds: String
});

/* =========================
   ALGOVISUALS
========================= */
const algovisuals_schema = new mongoose.Schema({
    id: { type: String, required: true },

    subtopicId: String,

    code_text: { type: String, required: true },
    code_steps: { type: String, required: true },
    input_array: { type: String, required: true }
});

/* =========================
   TOPICS
========================= */
const topics_schema = new mongoose.Schema({
    id: { type: String, required: true },
    title: String,
    content: String,

    subtopicId: { type: String, unique: true },

    commentIds: [String]
});

/* =========================
   COMMENTS
========================= */
const comments_schema = new mongoose.Schema({
    _id: { type: String },

    username: { type: String, required: true },
    message: { type: String, required: true },
    time: Date,

    topicId: { type: String, required: true }
});

/* =========================
   EXPORT MODELS
========================= */

export const Users = mongoose.models["Users"] || mongoose.model("Users", users_schema);
export const Set = mongoose.models["Set"] || mongoose.model("Set", set_schema);
export const Problem = mongoose.models["Problem"] || mongoose.model("Problem", problem_schema);
export const ProblemDescription = mongoose.models["ProblemDescription"] || mongoose.model("ProblemDescription", problem_description_schema);
export const ProblemVisuals = mongoose.models["ProblemVisuals"] || mongoose.model("ProblemVisuals", problem_visuals_schema);
export const UserProblem = mongoose.models["UserProblem"] || mongoose.model("UserProblem", user_problem_schema);
export const Tutorials = mongoose.models["Tutorials"] || mongoose.model("Tutorials", tutorials_schema);
export const Subtopic = mongoose.models["Subtopic"] || mongoose.model("Subtopic", subtopic_schema);
export const Algovisuals = mongoose.models["Algovisuals"] || mongoose.model("Algovisuals", algovisuals_schema);
export const Topics = mongoose.models["Topics"] || mongoose.model("Topics", topics_schema);
export const Comments = mongoose.models["Comments"] || mongoose.model("Comments", comments_schema);