export default async function handler(req, res) {
  // 1. 전체 주소에서 순수한 shortId만 뽑아냅니다.
  // 주소창에 들어온 /s/abc?path=abc 형태에서 쿼리스트링(?)을 제거합니다.
  const cleanUrl = req.url.split('?')[0]; 
  const shortId = cleanUrl.split('/').pop();

  if (!shortId || shortId === 's') {
    return res.status(404).send("잘못된 접근입니다. 코드가 없습니다.");
  }

  const { SUPABASE_URL, SUPABASE_KEY } = process.env;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/urls?short_id=eq.${shortId}&select=original_url`, {
      headers: { 
        'apikey': SUPABASE_KEY, 
        'Authorization': `Bearer ${SUPABASE_KEY}` 
      }
    });
    
    const data = await response.json();

    if (data && data.length > 0) {
      // 성공 시 해당 주소로 이동
      res.writeHead(302, { Location: data[0].original_url });
      res.end();
    } else {
      // DB에 없는 경우 표시되는 메시지
      res.status(404).send(`주소를 찾을 수 없습니다. (입력된 코드: ${shortId})`);
    }
  } catch (e) {
    res.status(500).send("서버 에러가 발생했습니다: " + e.message);
  }
}
