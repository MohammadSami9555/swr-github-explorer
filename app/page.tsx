"use client";

import { useState } from "react";
import useSWR from "swr";

type Repo = {
  id: number;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
};

type GithubResponse = {
  items: Repo[];
  message?: string;
};

const fetcher = (url: string) =>
  fetch(url).then((res) => res.json());

export default function Page() {
  const [query, setQuery] = useState("");

  const { data, error, isValidating } = useSWR<GithubResponse>(
    query
      ? `https://api.github.com/search/repositories?q=${encodeURIComponent(
          query
        )}`
      : null,
    fetcher
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background:
          "linear-gradient(135deg, #a855f7, #3b82f6)",
      }}
    >
      <div
        style={{
          width: "60%",
          background: "rgba(255,255,255,0.25)",
          padding: "40px",
          borderRadius: "20px",
          backdropFilter: "blur(8px)",
          boxShadow: "0 0 30px rgba(0,0,0,0.15)",
        }}
      >
        <h1
          style={{
            fontSize: "28px",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "10px",
          }}
        >
          🔍 SWR GitHub Repo Viewer
        </h1>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories..."
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginTop: "10px",
          }}
        />

        {error && <p>❌ Error fetching data</p>}
        {isValidating && <p>⏳ Loading...</p>}

        {data?.message && (
          <p style={{ color: "red" }}>
            ⛔ GitHub rate limit exceeded — thodi der baad try karo
          </p>
        )}

        {!isValidating && data?.items?.length === 0 && query && (
          <p>No results found</p>
        )}

        <div style={{ marginTop: "15px" }}>
          {data?.items?.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              style={{
                display: "block",
                padding: "12px",
                borderRadius: "10px",
                border: "1px solid #ddd",
                marginTop: "10px",
                background: "white",
              }}
            >
              <b>{repo.full_name}</b>
              <p style={{ fontSize: "13px" }}>{repo.description}</p>

              ⭐ {repo.stargazers_count} | 🍴 {repo.forks_count}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
