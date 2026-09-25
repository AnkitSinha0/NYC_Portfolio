/**
 * The publication's editorial content — one source of truth for every
 * page. Facts here come from the CV and the project repositories;
 * nothing is invented. Edit here, not in the pages.
 */

export const LINKS = {
  email: "ankits0057@gmail.com",
  github: "https://github.com/AnkitSinha0",
  linkedin: "https://www.linkedin.com/in/ankit0sinha/",
  x: "https://x.com/Haunts_01",
  instagram: "https://www.instagram.com/haunts_01/",
  resume: "/ankit-sinha-resume.pdf",
} as const;

export const NAV = [
  { href: "/", label: "Front Page" },
  { href: "/work", label: "Work" },
  { href: "/engineering", label: "Engineering" },
  { href: "/markets", label: "Coding Exchange" },
  { href: "/writing", label: "Writing" },
  { href: "/profile", label: "Profile" },
  { href: "/#contact", label: "Contact" },
] as const;

// ───────────────────────── technical desk ─────────────────────────

export type Tech = { name: string; icon: string; exploring?: boolean };

export const STACK: { desk: string; items: Tech[] }[] = [
  {
    desk: "Languages",
    items: [
      { name: "Go", icon: "go" },
      { name: "Java", icon: "java" },
      { name: "Python", icon: "python" },
      { name: "C++", icon: "cpp" },
      { name: "TypeScript", icon: "typescript" },
      { name: "JavaScript", icon: "javascript" },
      { name: "SQL", icon: "sql" },
    ],
  },
  {
    desk: "Backend",
    items: [
      { name: "Gin", icon: "gin" },
      { name: "Node.js", icon: "node" },
      { name: "Express", icon: "express" },
      { name: "FastAPI", icon: "fastapi" },
      { name: "GraphQL", icon: "graphql" },
    ],
  },
  {
    desk: "Data",
    items: [
      { name: "PostgreSQL", icon: "postgres" },
      { name: "MongoDB", icon: "mongodb" },
      { name: "Redis", icon: "redis" },
      { name: "MySQL", icon: "mysql" },
    ],
  },
  {
    desk: "Messaging",
    items: [
      { name: "RabbitMQ", icon: "rabbitmq" },
      { name: "Kafka", icon: "kafka" },
    ],
  },
  {
    desk: "Cloud / Infra",
    items: [
      { name: "AWS", icon: "aws" },
      { name: "Docker", icon: "docker" },
      { name: "GitHub Actions", icon: "actions" },
      { name: "Terraform", icon: "terraform" },
      { name: "Kubernetes", icon: "kubernetes", exploring: true },
    ],
  },
  {
    desk: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Next.js", icon: "next" },
    ],
  },
];

// ───────────────────────── work ─────────────────────────

export type Project = {
  slug: "hashvault" | "konnect";
  no: string;
  name: string;
  kicker: string;
  dek: string;
  teaser: string;
  stack: string[];
  date: string;
  status: string;
  github: string;
  githubLabel: string;
  overview: string[];
  problem: string[];
  features: [string, string][];
  decisions: [string, string][];
  reliability: string[];
  lessons: string[];
  report?: string; // engineering report slug
  /** Real planes of the system, for the terminal's spec sheet. */
  planes?: [string, string][];
  /** The project's own phase plan — progress is counted from this, never estimated. */
  roadmap?: { phase: string; done: boolean }[];
};

export const PROJECTS: Project[] = [
  {
    slug: "hashvault",
    no: "01",
    name: "HashVault",
    kicker: "Currently Building · Go",
    dek: "Content-addressable cloud storage.",
    teaser:
      "A Dropbox-like storage platform in Go that stores identical bytes exactly once. Files are addressed by their SHA-256 hash, uploads go browser-to-S3 on presigned URLs, and the Go server never touches the data plane.",
    stack: ["Go", "Gin", "PostgreSQL", "Redis", "RabbitMQ", "S3", "Docker", "Terraform"],
    date: "June 2026 — ongoing",
    status: "Phase 4b shipped: deduplication. Next: integration test suite.",
    github: "https://github.com/AnkitSinha0/HashVault",
    githubLabel: "AnkitSinha0/HashVault",
    overview: [
      "HashVault is a production-grade cloud storage platform built as a modular monolith: one Go binary, organised into repository, service and handler layers behind interfaces, so any module can be extracted into its own service later without rewriting it.",
      "Users get folders, uploads, downloads, share links and a 10 GB quota. Underneath, every file is a reference to a content-addressed storage object, which is what makes deduplication possible.",
    ],
    problem: [
      "Two users upload the same file. Most systems store it twice, and pay for it twice. At scale, duplicate bytes are a real share of storage cost.",
      "The second problem is bandwidth. If every byte passes through the API server, the server becomes the bottleneck and the most expensive part of the upload path.",
    ],
    features: [
      ["Content-addressable deduplication", "The client supplies a SHA-256 checksum. A dedup hit skips the upload entirely; the file row simply points at the existing object."],
      ["Presigned uploads", "The API issues a presigned PUT URL. File bytes travel browser → S3 directly; the server stays on the control plane."],
      ["Atomic reference counting", "Each storage object carries a ref count, incremented and decremented in SQL. The object is purged from S3 and Postgres only when it reaches zero."],
      ["Rotating refresh tokens", "15-minute HS256 access tokens paired with 64-character opaque refresh tokens, stored only as SHA-256 hashes in Redis and rotated on every refresh."],
      ["Google OAuth", "OAuth2 sign-in with the CSRF state held in Redis for ten minutes."],
      ["Async email", "Welcome and OTP emails go through a durable RabbitMQ topic exchange to a worker with prefetch 1."],
    ],
    decisions: [
      ["Modular monolith, not microservices", "One deployable keeps local development and transactions simple; clean interfaces keep the door open to extraction."],
      ["Objects keyed by checksum", "S3 keys are objects/{sha256}, so re-uploading identical bytes always resolves to the same key."],
      ["Sentinel errors at the boundary", "Repositories translate gorm.ErrRecordNotFound into their own ErrNotFound, so persistence details never leak into business logic."],
      ["Quota checked twice", "Storage quota is enforced at both init-upload and confirm, so a slow upload can't slip past a limit that changed meanwhile."],
    ],
    reliability: [
      "Redis degrades deliberately: fail-closed for refresh-token validation, fail-open for rate limiting.",
      "PostgreSQL connection pool capped at 25 connections.",
      "30-second graceful shutdown on SIGTERM drains in-flight requests.",
      "Message publishing is fire-and-forget; a bad payload is nacked without requeue, headed for a dead-letter queue.",
    ],
    lessons: [
      "Deduplication is a concurrency problem before it is a storage problem: fifty clients confirming the same checksum at once must produce one object with a ref count of fifty. That is why the next phase is an integration test suite against a real Postgres, not mocks.",
      "Keeping the server off the data plane changes every other decision — quotas, confirmation, and failure handling all move to the edges of the upload.",
    ],
    report: "content-addressable-storage",
    planes: [
      ["Control plane", "Go / Gin / PostgreSQL / Redis"],
      ["Data plane", "S3 / presigned URLs"],
      ["Messaging", "RabbitMQ"],
      ["Infrastructure", "Docker / Terraform"],
    ],
    // Mirrors the phase plan in the HashVault repository.
    roadmap: [
      { phase: "Foundation", done: true },
      { phase: "Models & repositories", done: true },
      { phase: "Auth (JWT + OAuth)", done: true },
      { phase: "Folders", done: true },
      { phase: "File upload (S3 / MinIO)", done: true },
      { phase: "Deduplication", done: true },
      { phase: "Test suite", done: false },
      { phase: "Multipart / resumable upload", done: false },
      { phase: "Adaptive chunking", done: false },
      { phase: "File sharing", done: false },
      { phase: "Email worker", done: false },
      { phase: "Rate limiting", done: false },
      { phase: "Audit log", done: false },
      { phase: "Observability", done: false },
      { phase: "Docker + CI/CD", done: false },
      { phase: "Terraform + AWS", done: false },
      { phase: "go-migrate", done: false },
      { phase: "Content-defined chunking", done: false },
      { phase: "Architecture document", done: false },
      { phase: "Performance numbers", done: false },
    ],
  },
  {
    slug: "konnect",
    no: "02",
    name: "Konnect",
    kicker: "Selected Work · Microservices",
    dek: "Real-time chat across six services.",
    teaser:
      "A real-time chat platform across six microservices behind Traefik, with a Socket.IO gateway and an event-driven backbone on RabbitMQ and Kafka feeding an AI moderation pipeline.",
    stack: ["Next.js", "Node.js", "Express", "MongoDB", "Redis", "RabbitMQ", "Kafka", "Python", "Docker"],
    date: "September 2025",
    status: "Complete.",
    github: "https://github.com/AnkitSinha0",
    githubLabel: "github.com/AnkitSinha0",
    overview: [
      "Konnect is a real-time chat platform split across six microservices: a Next.js frontend, a Socket.IO WebSocket gateway, and backend services behind a Traefik reverse proxy that routes by host rule.",
      "Services communicate through events rather than calling each other, and every chat message passes through an AI moderation pipeline before it can harm anyone.",
    ],
    problem: [
      "Chat is fan-out heavy and latency-sensitive, and a single slow dependency can stall every conversation if services call each other synchronously.",
      "Moderation has the opposite failure mode: judging each message alone produces false positives that punish ordinary banter.",
    ],
    features: [
      ["WebSocket gateway", "A persistent duplex Socket.IO channel, one connection per client."],
      ["Dual-token auth", "JWT RS256 access and refresh tokens: a private key signs, every service verifies with the public half."],
      ["OTP & OAuth", "Email OTP verification plus Google and GitHub OAuth 2.0 with CSRF-protected state."],
      ["Event backbone", "RabbitMQ and Apache Kafka decouple services; chat events route through topic-based consumers."],
      ["AI moderation", "RoBERTa and Toxic-BERT classify messages behind a Flask inference server."],
      ["Sliding-window judgement", "Redis aggregates flags over a sliding window, so the system judges a pattern of messages, never one alone."],
    ],
    decisions: [
      ["Events over RPC", "Services own their data and publish what happened; none reaches into another's store."],
      ["RS256 over HS256", "With six services verifying tokens, asymmetric keys mean only the auth service can mint them."],
      ["Kafka for ordered streams", "Ordered within a partition, consumers read by offset — the moderation pipeline can replay history."],
      ["Aggregate before acting", "A sliding window in Redis suppresses one-off false positives before a human ever sees them."],
    ],
    reliability: [
      "A slow consumer no longer blocks the chat path; messages queue instead of timing out.",
      "Traefik isolates routing from services, so a service can restart without clients reconnecting elsewhere.",
    ],
    lessons: [
      "Event-driven design moves complexity rather than removing it: ordering, idempotency and replay become explicit design questions.",
      "Moderation accuracy came less from the model than from the aggregation around it.",
    ],
    report: "message-driven-chat",
    planes: [
      ["Gateway", "Socket.IO / Traefik"],
      ["Services", "Node.js / Express / MongoDB"],
      ["Messaging", "RabbitMQ / Kafka"],
      ["Moderation", "Python / RoBERTa / Redis"],
    ],
  },
];

// ───────────────────────── engineering reports ─────────────────────────

export type Report = {
  slug: string;
  no: string;
  title: string;
  dek: string;
  filedUnder: string;
  project: string;
  date: string;
  diagram: "dedup" | "events" | "tokens" | "hmac";
  sections: { heading: string; body: string[] }[];
};

export const REPORTS: Report[] = [
  {
    slug: "content-addressable-storage",
    no: "001",
    title: "Content-Addressable Storage",
    dek: "Storing the same bytes once, and deleting them exactly when nobody needs them.",
    filedUnder: "Storage · Distributed Systems",
    project: "HashVault",
    date: "July 2026",
    diagram: "dedup",
    sections: [
      {
        heading: "Address by content, not by name",
        body: [
          "In HashVault a file is not its bytes. A file is a row that points at a storage object, and a storage object is keyed by the SHA-256 of its contents: objects/{checksum}. Two users uploading the same PDF produce two file rows and one object.",
          "Because the key is derived from the content, re-uploading identical bytes always resolves to the same key. There is nothing to look up by filename and nothing to reconcile.",
        ],
      },
      {
        heading: "The upload path",
        body: [
          "The client hashes the file and asks to upload. If the checksum already exists, the API answers deduplicated: true and skips issuing a presigned URL altogether — the upload round trip disappears.",
          "Otherwise the client receives a presigned PUT, sends bytes straight to S3, and confirms. The Go server only ever sees metadata. It lives on the control plane.",
        ],
      },
      {
        heading: "Reference counting is the hard part",
        body: [
          "Each object carries a ref count. Confirming an upload increments it; deleting a file decrements it; the object is purged from S3 and Postgres only when the count reaches zero. Both operations are atomic SQL, never read-modify-write in Go.",
          "The failure that matters is concurrency: fifty clients confirming the same checksum at the same moment must yield exactly one object with a count of fifty. That is a property of the database, so it is tested against a real Postgres rather than a mock.",
        ],
      },
      {
        heading: "Quota without surprises",
        body: [
          "Quota is checked at init and again at confirm. A deduplicated file still counts against the uploader's quota — storage is shared underneath, but accounting is per user.",
        ],
      },
    ],
  },
  {
    slug: "message-driven-chat",
    no: "002",
    title: "Designing a Message-Driven System",
    dek: "Six services, one conversation, and why none of them call each other.",
    filedUnder: "Messaging · Microservices",
    project: "Konnect",
    date: "September 2025",
    diagram: "events",
    sections: [
      {
        heading: "Publish what happened",
        body: [
          "Konnect's services never reach into one another. A service does its work, then publishes an event; whoever cares subscribes. The chat path stays fast because no step waits on a slower neighbour.",
        ],
      },
      {
        heading: "Two brokers, two jobs",
        body: [
          "RabbitMQ handles work that should happen once — deliver this, notify that — with acknowledgements and routing keys. Kafka carries the chat stream itself: ordered within a partition, retained, and readable by offset, so the moderation pipeline can be replayed.",
        ],
      },
      {
        heading: "Moderation as a consumer",
        body: [
          "Chat events flow through topic-based consumers into RoBERTa and Toxic-BERT behind a Flask inference server. A single message is rarely enough evidence, so Redis aggregates flags over a sliding window and the system judges a pattern, not a line.",
        ],
      },
      {
        heading: "What it costs",
        body: [
          "Decoupling moves complexity into ordering, idempotency and replay. Each consumer has to tolerate seeing an event twice, and each topic has to be designed around what must stay in order.",
        ],
      },
    ],
  },
  {
    slug: "token-rotation",
    no: "003",
    title: "JWT Rotation and Authentication Architecture",
    dek: "Short-lived access, opaque refresh, and a stolen token that cannot be replayed.",
    filedUnder: "Security · Authentication",
    project: "HashVault · Konnect",
    date: "June 2026",
    diagram: "tokens",
    sections: [
      {
        heading: "Two tokens, two lifetimes",
        body: [
          "HashVault issues a 15-minute HS256 access token carrying the user's ID and email, and a 64-character opaque refresh token valid for seven days. The access token is verified statelessly; the refresh token is checked against Redis.",
        ],
      },
      {
        heading: "Never store the secret",
        body: [
          "Refresh tokens are never stored in plaintext. Redis holds refresh_token:{sha256(token)} — a leaked Redis snapshot contains nothing a client could present.",
        ],
      },
      {
        heading: "Rotate on every use",
        body: [
          "Every call to /refresh deletes the old key before issuing a new pair. A refresh token works exactly once, so a stolen one is either already spent or revealed the moment both parties try to use it.",
        ],
      },
      {
        heading: "Fail closed",
        body: [
          "If Redis is unavailable, refresh fails rather than waving the request through. Rate limiting fails open; authentication never does.",
          "Konnect takes the asymmetric route: RS256, where only the auth service holds the private key and the other five services verify with the public half.",
        ],
      },
    ],
  },
  {
    slug: "payment-verification",
    no: "004",
    title: "Payments Confirmed on Cryptographic Proof",
    dek: "Why a donation is not complete because the browser says so.",
    filedUnder: "Security · Payments",
    project: "Denthinkers Foundation",
    date: "April 2026",
    diagram: "hmac",
    sections: [
      {
        heading: "Don't trust the client",
        body: [
          "A payment page that marks a donation successful because the browser reported success can be fooled by anyone with developer tools. At Denthinkers Foundation the donation module treats the client's claim as a hint, not a fact.",
        ],
      },
      {
        heading: "Verify the signature",
        body: [
          "Razorpay signs each completed order. The server recomputes an HMAC-SHA256 over the order and payment IDs with the merchant secret and compares it with the signature returned. Only a match marks the payment confirmed.",
        ],
      },
      {
        heading: "In production",
        body: [
          "The module spans fifteen API route handlers and twenty-three endpoints, with cookie-based JWT admin auth behind middleware-gated routes. It has processed more than ₹1.5 lakh in verified transactions on a platform serving over 2,500 monthly visits.",
        ],
      },
    ],
  },
];

// ───────────────────────── beyond the stack ─────────────────────────

/**
 * Hobby galleries. Add real work here — drop files in /public/<desk>/
 * and list them. Pages show an honest empty state until then.
 */
export type Plate = { src: string; title: string; caption: string; meta: string };

export const HOBBIES = {
  photography: {
    title: "Photography",
    line: "Selected frames, places and observations.",
    verb: "Explore",
    plates: [] as Plate[],
  },
  drawing: {
    title: "Drawing",
    line: "Sketchbook and visual studies.",
    verb: "View",
    plates: [] as Plate[],
  },
  gaming: {
    title: "Gaming",
    line: "The unofficial game room.",
    verb: "Enter",
    plates: [] as Plate[],
  },
} as const;

// ───────────────────────── the desk, scene by scene ─────────────────────────

/**
 * What the front page's margins say while each section is being read.
 * `id` is the section's element id on the home page.
 */
export type Scene = {
  id: string;
  left: { title: string; line: string; quote?: string };
  right: { title: string; big?: string; line: string; foot: string };
  vert: string;
};

export const HOME_SCENES: Scene[] = [
  {
    id: "lead",
    left: { title: "Engineering Desk", line: "Systems · Storage · Cloud", quote: "Build it. Break it. Understand it." },
    right: { title: "Currently Building", big: "HashVault", line: "Go · PostgreSQL · Redis · RabbitMQ · S3", foot: "Vol. 01 · 2026" },
    vert: "Vol. 01 · The Front Page · Backend Engineering",
  },
  {
    id: "desk",
    left: { title: "Infrastructure Report", line: "Go · K8s · AWS", quote: "Tools in daily use." },
    right: { title: "The Index", big: "6 desks", line: "Languages · Backend · Data · Messaging · Cloud · Frontend", foot: "Filed under: Stack" },
    vert: "Vol. 01 · Technical Desk · Tools in Daily Use",
  },
  {
    id: "building",
    left: { title: "Construction Notes", line: "Phase 4b shipped · Deduplication", quote: "Store the same bytes once." },
    right: { title: "Plate I", big: "HV-01", line: "Control plane · Data plane", foot: "Drawn by A. Sinha" },
    vert: "Vol. 01 · Currently Building · HashVault",
  },
  {
    id: "work",
    left: { title: "Feature Pages", line: "Konnect · Denthinkers", quote: "What has been built." },
    right: { title: "Dispatch", big: "₹1.5L+", line: "Verified on cryptographic proof", foot: "Nov 2025 – Apr 2026" },
    vert: "Vol. 01 · Selected Work · Case Studies",
  },
  {
    id: "eng",
    left: { title: "Technical Reports", line: "001 — 004", quote: "How the systems are thought through." },
    right: { title: "Blueprint Room", big: "Rev 1", line: "Storage · Messaging · Security", foot: "Engineering Desk" },
    vert: "Vol. 01 · Engineering Desk · Technical Reports",
  },
  {
    id: "exch",
    left: { title: "Market Hours", line: "LeetCode · Codeforces", quote: "The market rewards those who show up." },
    right: { title: "The Exchange", big: "Live", line: "Refreshed hourly", foot: "Close of trading" },
    vert: "Vol. 01 · Coding Exchange · Market Report",
  },
  {
    id: "beyond",
    left: { title: "Late Edition", line: "Beyond the Stack", quote: "The person behind the systems." },
    right: { title: "Arts & Leisure", big: "Off duty", line: "Photography · Drawing · Gaming", foot: "Weekend section" },
    vert: "Vol. 01 · Beyond the Stack · Arts & Leisure",
  },
  {
    id: "terminal",
    left: { title: "System Access", line: "ankit@ankitsin", quote: "Type help." },
    right: { title: "Session Open", big: "tty1", line: "↑ history · Tab completes", foot: "zsh · 80×24" },
    vert: "Vol. 01 · The Terminal · System Access",
  },
  {
    id: "contact",
    left: { title: "The Closing Edition", line: "Get in touch", quote: "Let's build something that survives production." },
    right: { title: "Printed at Patna", big: "Issue 001", line: "ankitsin.in", foot: "End of edition" },
    vert: "Vol. 01 · The Closing Edition · Contact",
  },
];
