import { Post } from "../types";
import Bar from "../components/Bar";

interface PostViewProps {
  post: Post;
  onBack: () => void;
}

export default function PostView({ post, onBack }: PostViewProps) {
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
          ← Writing
        </button>

        {post.image ? (
          <img
            src={post.image}
            alt=""
            style={{
              width: "100%",
              aspectRatio: "3/2",
              objectFit: "cover",
              borderRadius: 6,
              marginBottom: 36,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              aspectRatio: "3/2",
              borderRadius: 6,
              background: "var(--dim)",
              marginBottom: 36,
            }}
          />
        )}

        <p style={{ fontSize: 13, color: "var(--subtle)", marginBottom: 10 }}>
          {post.date}
        </p>

        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            letterSpacing: "-0.02em",
            lineHeight: 1.3,
            marginBottom: 28,
            maxWidth: 440,
          }}
        >
          {post.title}
        </h1>

        <Bar />

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {post.content.map((para, i) => (
            <p
              key={i}
              style={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "var(--body)",
                maxWidth: 458,
              }}
            >
              {para}
            </p>
          ))}
        </div>

      </div>
    </div>
  );
}
