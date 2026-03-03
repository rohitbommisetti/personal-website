import { useState } from "react";
import { Post } from "./types";
import HomeView from "./views/HomeView";
import WritingView from "./views/WritingView";
import PostView from "./views/PostView";

type View = "home" | "writing" | Post;

export default function App() {
  const [view, setView] = useState<View>("home");

  if (view !== "home" && view !== "writing") {
    // view is a Post object
    return (
      <PostView
        post={view}
        onBack={() => setView("writing")}
      />
    );
  }

  if (view === "writing") {
    return (
      <WritingView
        onSelectPost={(post) => setView(post)}
        onBack={() => setView("home")}
      />
    );
  }

  return (
    <HomeView
      onSelectPost={(post) => setView(post)}
      onViewWriting={() => setView("writing")}
    />
  );
}
