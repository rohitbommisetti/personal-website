import { Post } from "../types";
import Bar from "../components/Bar";
import Row from "../components/Row";
import posts from "../posts";

// ── Dune quotes — one picked at random on each page load ──────────────────────
const duneQuotes = [
  "I must not fear. Fear is the mind-killer. Fear is the little-death that brings total obliteration. I will face my fear. I will permit it to pass over me and through me.",
  "The mystery of life isn't a problem to solve, but a reality to experience.",
  "Deep in the human unconscious is a pervasive need for a logical universe that makes sense. But the real universe is always one step beyond logic.",
  "The people who can destroy a thing, they control it.",
  "There is no escape — we pay for the violence of our ancestors.",
  "Without change, something sleeps inside us, and seldom awakens. The sleeper must awaken.",
  "The first step in avoiding a trap is knowing it exists.",
  "Survival is the ability to swim in strange water.",
  "The highest function of ecology is understanding consequences.",
  "A process cannot be understood by stopping it. Understanding must move with the flow of the process, must join it and flow with it.",
  "Hope clouds observation.",
  "Any road followed precisely to its end leads precisely nowhere. Climb the mountain just a little bit to test it's a mountain. From the top of the mountain, you cannot see the mountain.",
  "The willow submits to the wind and prospers until one day it is many willows — a wall against the wind.",
];

const randomQuote = duneQuotes[Math.floor(Math.random() * duneQuotes.length)];

interface HomeViewProps {
  onSelectPost: (post: Post) => void;
  onViewWriting: () => void;
}

export default function HomeView({ onSelectPost, onViewWriting }: HomeViewProps) {
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

        <p style={{ fontSize: 18, fontWeight: 500, letterSpacing: "-0.02em", marginBottom: 6 }}>
          Rohit Bommisetti
        </p>
        <p style={{ fontSize: 18, marginBottom: 16 }}>👾</p>

        <div
          style={{
            fontSize: 15,
            lineHeight: 1.55,
            maxWidth: 458,
            marginBottom: 32,
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <p>
            I'm currently working on transforming businesses with AI at{" "}
            <a href="https://www.renovuscapital.com" target="_blank" rel="noreferrer">
              Renovus Capital
            </a>
            . I believe the next chapter of American dynamism will be written in how we apply AI to real economy.
          </p>
          <p>
            I previously worked on reducing oncology readmissions at CMU, building a student entrepreneurship community, and teaching AI with a team from Stanford. I studied economics at the University of Pittsburgh.
          </p>
          <p>When I'm not working, I'm probably deep in a biography, on a trail, or in the ocean.</p>

          <div style={{ display: "flex", gap: 20 }}>
            <a href="https://www.linkedin.com/in/rohitbommisetti" target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="https://x.com/rohitbommisetti" target="_blank" rel="noreferrer">X</a>
            <a href="mailto:rohit.bommisetti@renovuscapital.com">Email</a>
          </div>
        </div>

        <Bar />

        <Row label="Writing" mb={40}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => onSelectPost(post)}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px 0",
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

            <button
              onClick={onViewWriting}
              style={{
                background: "none",
                border: "none",
                padding: "6px 0 2px",
                fontFamily: "inherit",
                fontSize: 13,
                color: "var(--subtle)",
                textAlign: "left",
                cursor: "pointer",
                marginTop: 6,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "var(--subtle)")}
            >
              more →
            </button>
          </div>
        </Row>

        <Bar />

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            color: "var(--muted)",
            fontStyle: "italic",
            maxWidth: 458,
          }}
        >
          "{randomQuote}"
        </p>

      </div>
    </div>
  );
}
