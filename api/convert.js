export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method Not Allowed');

  const { targetUrl, shortId } = req.body;
  // Vercel 금고(환경변수)에서 키를 꺼내옵니다.
  const { SUPABASE_URL, SUPABASE_KEY } = process.env;

  try {
    // 1. 중복 확인
    const check = await fetch(`${SUPABASE_URL}/rest/v1/urls?original_url=eq.${encodeURIComponent(targetUrl)}&select=short_id`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const existing = await check.json();

    if (existing.length > 0) {
      return res.status(200).json({ shortId: existing[0].short_id });
    }

    // 2. 신규 저장
    const save = await fetch(`${SUPABASE_URL}/rest/v1/urls`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=minimal'
      },
      body: JSON.stringify({ short_id: shortId, original_url: targetUrl })
    });

    if (save.ok) return res.status(200).json({ shortId });
    else throw new Error('DB 저장 실패');

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
