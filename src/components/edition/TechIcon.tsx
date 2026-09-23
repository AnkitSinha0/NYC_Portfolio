import {
  siApachekafka,
  siCplusplus,
  siDocker,
  siExpress,
  siFastapi,
  siGin,
  siGithubactions,
  siGo,
  siGraphql,
  siJavascript,
  siKubernetes,
  siMongodb,
  siMysql,
  siNextdotjs,
  siNodedotjs,
  siOpenjdk,
  siPostgresql,
  siPython,
  siRabbitmq,
  siReact,
  siRedis,
  siTerraform,
  siTypescript,
} from "simple-icons";

type Mark = { path: string; hex: string };

// Simple Icons (CC0). Rendered in ink; the brand colour appears on hover.
const MARKS: Record<string, Mark> = {
  go: siGo,
  java: siOpenjdk,
  python: siPython,
  cpp: siCplusplus,
  typescript: siTypescript,
  javascript: siJavascript,
  gin: siGin,
  node: siNodedotjs,
  express: siExpress,
  fastapi: siFastapi,
  graphql: siGraphql,
  postgres: siPostgresql,
  mongodb: siMongodb,
  redis: siRedis,
  mysql: siMysql,
  rabbitmq: siRabbitmq,
  kafka: siApachekafka,
  docker: siDocker,
  actions: siGithubactions,
  terraform: siTerraform,
  kubernetes: siKubernetes,
  react: siReact,
  next: siNextdotjs,
};

/** A technology mark at 24×24. AWS and SQL have no simple mark, so they get plain monograms. */
export function TechIcon({ icon }: { icon: string }) {
  const mark = MARKS[icon];
  if (mark) {
    return (
      <svg viewBox="0 0 24 24" className="ti" aria-hidden="true" style={{ ["--brand" as string]: `#${mark.hex}` }}>
        <path d={mark.path} />
      </svg>
    );
  }
  if (icon === "sql") {
    return (
      <svg viewBox="0 0 24 24" className="ti" aria-hidden="true" style={{ ["--brand" as string]: "#336791" }}>
        <path d="M12 2C7 2 3.5 3.6 3.5 5.5v13C3.5 20.4 7 22 12 22s8.5-1.6 8.5-3.5v-13C20.5 3.6 17 2 12 2Zm0 1.8c4.2 0 6.7 1.2 6.7 1.7S16.2 7.2 12 7.2 5.3 6 5.3 5.5 7.8 3.8 12 3.8ZM5.3 7.7C6.9 8.5 9.3 9 12 9s5.1-.5 6.7-1.3v3.8c0 .5-2.5 1.7-6.7 1.7s-6.7-1.2-6.7-1.7Zm0 6c1.6.8 4 1.3 6.7 1.3s5.1-.5 6.7-1.3v4.8c0 .5-2.5 1.7-6.7 1.7s-6.7-1.2-6.7-1.7Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" className="ti mono" aria-hidden="true" style={{ ["--brand" as string]: "#FF9900" }}>
      <text x="12" y="15.5" textAnchor="middle">{icon.toUpperCase().slice(0, 3)}</text>
    </svg>
  );
}
