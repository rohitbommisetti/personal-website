// ── Barrel: import all posts and export as an ordered array ───────────────────
// To add a new post: create a new .tsx file in this folder and add it here.

import aiInPE from "./ai-rollups";
import realEconomy from "./real-economy-technology";
import spain from "./spain-2026";
import india from "./india-2025";

import { Post } from "../types";

const posts: Post[] = [aiInPE];

export default posts;
