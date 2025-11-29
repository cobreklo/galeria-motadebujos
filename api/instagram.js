export default async function handler(req, res) {
  const igBasicToken = process.env.INSTAGRAM_TOKEN;
  const fbToken = process.env.FB_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;
  try {
    if (igBasicToken) {
      const url = 'https://graph.instagram.com/me/media'
        + '?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp'
        + `&access_token=${igBasicToken}`;
      const r = await fetch(url);
      const j = await r.json();
      if (!r.ok) return res.status(r.status).json(j);
      const data = Array.isArray(j.data) ? j.data : [];
      if (String(req.query.expand).toLowerCase() === 'children') {
        const flat = [];
        for (const it of data) {
          if (it.media_type === 'CAROUSEL_ALBUM') {
            try {
              const cUrl = `https://graph.instagram.com/${it.id}/children?fields=id,media_type,media_url,thumbnail_url&access_token=${encodeURIComponent(igBasicToken)}`;
              const cr = await fetch(cUrl); const cj = await cr.json();
              const ch = Array.isArray(cj.data) ? cj.data : [];
              ch.forEach(child => flat.push({ ...it, parentId: it.id, id: child.id, media_type: child.media_type, media_url: child.media_url || child.thumbnail_url, thumbnail_url: child.thumbnail_url, permalink: it.permalink, timestamp: it.timestamp }));
            } catch {}
          } else {
            flat.push(it);
          }
        }
        return res.status(200).json({ data: flat });
      }
      return res.status(200).json(j);
    }
    if (fbToken && igUserId) {
      const url = `https://graph.facebook.com/v19.0/${igUserId}/media` 
        + '?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
        + `&access_token=${fbToken}`;
      const r = await fetch(url);
      const j = await r.json();
      if (!r.ok) return res.status(r.status).json(j);
      const data = Array.isArray(j.data) ? j.data : [];
      if (String(req.query.expand).toLowerCase() === 'children') {
        const flat = [];
        for (const it of data) {
          if (it.media_type === 'CAROUSEL_ALBUM') {
            try {
              const cUrl = `https://graph.facebook.com/v19.0/${it.id}/children?fields=id,media_type,media_url,thumbnail_url&access_token=${encodeURIComponent(fbToken)}`;
              const cr = await fetch(cUrl); const cj = await cr.json();
              const ch = Array.isArray(cj.data) ? cj.data : [];
              ch.forEach(child => flat.push({ ...it, parentId: it.id, id: child.id, media_type: child.media_type, media_url: child.media_url || child.thumbnail_url, thumbnail_url: child.thumbnail_url, permalink: it.permalink, timestamp: it.timestamp }));
            } catch {}
          } else {
            flat.push(it);
          }
        }
        return res.status(200).json({ data: flat });
      }
      return res.status(200).json(j);
    }
    return res.status(500).json({ error: 'Missing token: set INSTAGRAM_TOKEN (Basic Display) or FB_ACCESS_TOKEN + IG_USER_ID (Graph API)' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}