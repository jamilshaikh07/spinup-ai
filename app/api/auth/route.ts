export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { code } = await req.json();
  const expected = process.env.ACCESS_CODE;
  if (!expected) return Response.json({ ok: false }, { status: 503 });
  if (code !== expected) return Response.json({ ok: false }, { status: 401 });
  return Response.json({ ok: true });
}
