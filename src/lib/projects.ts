export type Project = {
  slug: string;
  title: string;
  dek: string;
  byline: string;
  stack: string[];
  intro: string[];
  detail: string[];
};

// Content sourced directly from the CV — ARCHITECTURE.md §1a is the
// canonical list. Do not add claims that aren't in it.
export const PROJECTS: Project[] = [
  {
    slug: "hashvault",
    title: "The Same Bytes, Stored Once",
    dek: "HashVault — Cloud Storage Platform",
    byline: "Go, Gin, PostgreSQL, GORM, Redis, RabbitMQ, AWS S3, MinIO, Docker · Mar 2026 – Present",
    stack: ["Go", "Gin", "PostgreSQL", "GORM", "Redis", "RabbitMQ", "AWS S3", "MinIO", "Docker"],
    intro: [
      "Two users upload the same file. Most systems store it twice. HashVault hashes the content with SHA-256 and resolves identical bytes to a single S3 key — reference counts increment and decrement atomically in SQL, and the object is purged from S3 and Postgres only when the count reaches zero. A dedup hit skips the upload round trip entirely.",
      "The service is a modular monolith in Go: interface-driven repository, service and handler layers, with a sentinel-error boundary that keeps persistence failures from leaking into business logic.",
    ],
    detail: [
      "A two-token auth scheme pairs HS256 JWT access tokens (15-minute TTL) with 64-character opaque refresh tokens, stored only as SHA-256 hashes in Redis — the prior key is deleted on every refresh, so a stolen token cannot be replayed.",
      "Presigned S3 upload and download let file bytes move browser-to-S3 directly, keeping the Go server on the control plane; per-user storage quota is enforced at both upload initiation and confirmation.",
      "An async event pipeline runs on RabbitMQ — a durable topic exchange, a prefetch-1 consumer, ack/nack-without-requeue — alongside fail-closed Redis for refresh-token lookups. Google OAuth 2.0 uses CSRF state tokens held in Redis.",
      "Hardened for production operation with PostgreSQL connection-pool tuning (25 max open connections), a 30-second graceful shutdown on SIGTERM to drain in-flight requests, layered Viper configuration (YAML overridden by environment), and Zap structured logging.",
    ],
  },
  {
    slug: "konnect",
    title: "Six Services, One Conversation",
    dek: "Konnect — Real-Time Chat Platform",
    byline: "Next.js, Express, MongoDB, Redis, RabbitMQ, Kafka, Docker · Sept 2025",
    stack: ["Next.js", "Express", "MongoDB", "Redis", "RabbitMQ", "Kafka", "Docker", "Socket.IO"],
    intro: [
      "A real-time chat platform architected across six microservices, with a Socket.IO WebSocket gateway and a Traefik reverse proxy in front of them. Auth runs on JWT RS256 dual tokens, with OTP email verification and Google/GitHub OAuth 2.0 protected by CSRF state.",
    ],
    detail: [
      "An event-driven pub/sub backbone on RabbitMQ and Apache Kafka decouples the services, routing chat events through topic-based consumers into an AI moderation pipeline.",
      "Redis sliding-window aggregation suppresses false-positive harassment flags — the moderation layer reacts to a pattern of messages, not a single one taken out of context.",
    ],
  },
];

export function getProject(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}
