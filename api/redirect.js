export default async function handler(req, res) {
  // 주소에서 's/' 뒤에 오는 글자만 정확히 가져옵니다.
  const urlParts = req.url.split('/s/');
  const shortId = urlParts.length > 1 ? urlParts[1] : null;

  if (!shortId) {
    return res.status(404).send("잘못된 접근입니다. (코드 없음)");
  }

  const SUPABASE_URL = "https://zefsltbwunyxqadwumfb.supabase.co";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplZnNsdGJ3dW55eHFhZHd1bWZiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzA4NzAwNSwiZXhwIjoyMDkyNjYzMDA1fQ.zpTTsmrPB5ijJt1_XQ-v4J9YcoxDmRmGE05t25Cbdlo";

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/urls?short_id=eq.${shortId}&select=original_url`, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    
    const data = await response.json();

    if (data && data.length > 0) {
      // 찾았다면 리다이렉트
      res.writeHead(302, { Location: data[0].original_url });
      res.end();
    } else {
      // DB에 해당 short_id가 없는 경우
      res.status(404).send(`주소를 찾을 수 없습니다. (입력된 코드: ${shortId})`);
    }
  } catch (e) {
    res.status(500).send("서버 에러: " + e.message);
  }
}
