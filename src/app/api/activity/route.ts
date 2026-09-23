import { getActivity } from "@/lib/activity";

// Keep in step with ACTIVITY_REVALIDATE in src/lib/activity/sources.ts (must be a literal here).
export const revalidate = 300;

/** The Developer Exchange tape — see src/lib/activity for the shape. */
export async function GET() {
  return Response.json(await getActivity());
}
