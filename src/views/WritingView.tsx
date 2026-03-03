import { Post } from "../types";
import Bar from "../components/Bar";
import posts from "../posts";

interface WritingViewProps {
  onSelectPost: (post: Post) => void;
  onBack: () => void;
}

export default function WritingView({ onSelectPost, onBack }: WritingViewProps) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 550, padding: "52px 24px 160px" }}>

        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            fontFamily: "inherit",
            fontSize: 15,
            color: "var(--subtle)",
            marginBottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          ← Home
        </button>

        <p style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 28 }}>
          Writing
        </p>

        <Bar />

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onSelectPost(post)}
              style={{
                background: "none",
                border: "none",
                padding: "6px 0",
                fontFamily: "inherit",
                fontSize: 15,
                color: "var(--text)",
                textAlign: "left",
                lineHeight: 1.6,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
                width: "100%",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.45")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <span>{post.title}</span>
              <span style={{ fontSize: 12, color: "var(--subtle)", flexShrink: 0 }}>
                {post.date}
              </span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}
