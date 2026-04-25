export default async function handler(req, res) {
  // 주소에서 'abc' 같은 코드만 추출합니다.
  const shortId = req.url.split('/').pop();

  const SUPABASE_URL = "https://zefsltbwunyxqadwumfb.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZnNsdGJ3dW55eHFhZHd1bWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA4NzAwNSwiZXhwIjoyMDkyNjYzMDA1fQ.zpTTsmrPB5ijJt1_XQ-v4J9YcoxDmRmGE05t25Cbdlo";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/urls?short_id=eq.${shortId}&select=original_url`, {
      headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
    });
    const data = await response.json();

    if (data && data.length > 0) {
      // DB에 주소가 있으면 그리로 보냅니다 (302 리다이렉트)
      res.writeHead(302, { Location: data[0].original_url });
      res.end();
    } else {
      res.status(404).send("주소를 찾을 수 없습니다.");
    }
  } catch (e) {
    res.status(500).send("서버 에러가 발생했습니다.");
  }
}
