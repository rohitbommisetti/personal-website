// ── Barrel: import all posts and export as an ordered array ───────────────────
// To add a new post: create a new .tsx file in this folder and add it here.

import aiInPE from "./ai-in-private-equity";
import realEconomy from "./real-economy-technology";
import oncology from "./oncology-readmissions";
import communities from "./building-communities";

import { Post } from "../types";

const posts: Post[] = [aiInPE, realEconomy, oncology, communities];

export default posts;
