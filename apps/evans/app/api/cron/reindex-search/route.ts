import type { NextRequest } from 'next/server';
import sendSearchDataToAlgolia from '@/lib/ssg/algolia';

export const dynamic = `force-dynamic`;
export const runtime = `nodejs`;
export const maxDuration = 60;

export async function GET(request: NextRequest): Promise<Response> {
  const authHeader = request.headers.get(`authorization`);
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(`Unauthorized`, { status: 401 });
  }

  try {
    await sendSearchDataToAlgolia();
    return Response.json({ success: true, at: new Date().toISOString() });
  } catch (error) {
    process.stderr.write(`reindex-search cron failed: ${error}\n`);
    return new Response(`Reindex failed`, { status: 500 });
  }
}
