export default async function handler(req, res) {
  const oembedList = (req.query?.oembed||"").split(",").map(s=>s.trim()).filter(Boolean);
  const appId = process.env.FB_APP_ID; const appSecret = process.env.FB_APP_SECRET;
  const igBasicToken = process.env.INSTAGRAM_TOKEN;
  const fbToken = process.env.FB_ACCESS_TOKEN;
  const igUserId = process.env.IG_USER_ID;
  try { res.setHeader('Cache-Control','public, max-age=600');
  if (!igBasicToken && !fbToken) {
      if (oembedList.length && appId && appSecret) {
        const nested = [];
        for (const url of oembedList) {
          try {
            const oe = await fetch(`https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(appId+'|'+appSecret)}`);
            const j = await oe.json();
            let stamp = j.upload_date || j.timestamp || j.published_time || j.updated_time || null;
            if (!stamp) {
              try {
                const hr = await fetch(url); const ht = await hr.text();
                const m1 = ht.match(/"taken_at":\s*(\d+)/);
                const m2 = ht.match(/"datePublished":"([^"]+)"/);
                const m3 = ht.match(/"upload_date":"([^"]+)"/);
                if (m1) stamp = new Date(Number(m1[1])*1000).toISOString();
                else if (m2) stamp = new Date(m2[1]).toISOString();
                else if (m3) stamp = new Date(m3[1]).toISOString();
              } catch {}
            }
            if (j && j.thumbnail_url) nested.push({ id: 'oembed:'+url, caption: j.title||'', media_type: 'IMAGE', media_url: j.thumbnail_url, thumbnail_url: j.thumbnail_url, permalink: url, timestamp: stamp || new Date().toISOString(), children: [] });
          } catch {}
        }
        return res.status(200).json({ data: nested });
      }
  }
  if (igBasicToken) {
      const url = 'https://graph.instagram.com/me/media'
        + '?fields=id,caption,media_url,permalink,media_type,thumbnail_url,timestamp'
        + `&access_token=${igBasicToken}`
        + `&limit=${Math.max(1, Math.min(Number(req.query.max) || 200, 500))}`;
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
      if (String(req.query.nested).toLowerCase() === 'true') {
        const nested = await Promise.all(data.map(async it => {
          if (it.media_type === 'CAROUSEL_ALBUM') {
            try {
              const cUrl = `https://graph.instagram.com/${it.id}/children?fields=id,media_type,media_url,thumbnail_url&access_token=${encodeURIComponent(igBasicToken)}`;
              const cr = await fetch(cUrl); const cj = await cr.json();
              const ch = Array.isArray(cj.data) ? cj.data : [];
              return { ...it, children: ch };
            } catch {
              return { ...it, children: [] };
            }
          }
          return it;
        }));

        if (oembedList.length && appId && appSecret) {
          for (const url of oembedList) {
            try {
              const oe = await fetch(`https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(appId+'|'+appSecret)}`);
              const j = await oe.json();
              let stamp = j.upload_date || j.timestamp || j.published_time || j.updated_time || null;
              if (!stamp) {
                try {
                  const hr = await fetch(url); const ht = await hr.text();
                  const m1 = ht.match(/"taken_at":\s*(\d+)/);
                  const m2 = ht.match(/"datePublished":"([^"]+)"/);
                  const m3 = ht.match(/"upload_date":"([^"]+)"/);
                  if (m1) stamp = new Date(Number(m1[1])*1000).toISOString();
                  else if (m2) stamp = new Date(m2[1]).toISOString();
                  else if (m3) stamp = new Date(m3[1]).toISOString();
                } catch {}
              }
              if (j && j.thumbnail_url) nested.push({ id: 'oembed:'+url, caption: j.title||'', media_type: 'IMAGE', media_url: j.thumbnail_url, thumbnail_url: j.thumbnail_url, permalink: url, timestamp: stamp || new Date().toISOString(), children: [] });
            } catch {}
          }
        }



        return res.status(200).json({ data: nested });
      }
      return res.status(200).json(j);
    }
  if (fbToken && igUserId) {
      const url = `https://graph.facebook.com/v19.0/${igUserId}/media` 
        + '?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
        + `&access_token=${fbToken}`
        + `&limit=${Math.max(1, Math.min(Number(req.query.max) || 200, 500))}`;
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
      if (String(req.query.nested).toLowerCase() === 'true') {
        const nested = await Promise.all(data.map(async it => {
          if (it.media_type === 'CAROUSEL_ALBUM') {
            try {
              const cUrl = `https://graph.facebook.com/v19.0/${it.id}/children?fields=id,media_type,media_url,thumbnail_url&access_token=${encodeURIComponent(fbToken)}`;
              const cr = await fetch(cUrl); const cj = await cr.json();
              const ch = Array.isArray(cj.data) ? cj.data : [];
              return { ...it, children: ch };
            } catch {
              return { ...it, children: [] };
            }
          }
          return it;
        }));
        if (oembedList.length) {
          for (const url of oembedList) {
            try {
              if (appId && appSecret) {
                const oe = await fetch(`https://graph.facebook.com/v19.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=${encodeURIComponent(appId+'|'+appSecret)}`);
                const j = await oe.json();
                let stamp = j.upload_date || j.timestamp || j.published_time || j.updated_time || null;
                if (!stamp) {
                  try {
                    const hr = await fetch(url); const ht = await hr.text();
                    const m1 = ht.match(/"taken_at":\s*(\d+)/);
                    const m2 = ht.match(/"datePublished":"([^"]+)"/);
                    const m3 = ht.match(/"upload_date":"([^"]+)"/);
                    if (m1) stamp = new Date(Number(m1[1])*1000).toISOString();
                    else if (m2) stamp = new Date(m2[1]).toISOString();
                    else if (m3) stamp = new Date(m3[1]).toISOString();
                  } catch {}
                }
                const thumb = j.thumbnail_url || null;
                if (thumb) nested.push({ id: 'oembed:'+url, caption: j.title||'', media_type: 'IMAGE', media_url: thumb, thumbnail_url: thumb, permalink: url, timestamp: stamp || new Date().toISOString(), children: [] });
                else {
                  try {
                    const hr = await fetch(url); const ht = await hr.text();
                    const img = (ht.match(/property=\"og:image\"[^>]*content=\"([^\"]+)\"/)||[])[1];
                    if (img) nested.push({ id: 'oembed:'+url, caption: j.title||'', media_type: 'IMAGE', media_url: img, thumbnail_url: img, permalink: url, timestamp: stamp || new Date().toISOString(), children: [] });
                  } catch {}
                }
              } else {
                try {
                  const hr = await fetch(url); const ht = await hr.text();
                  const img = (ht.match(/property=\"og:image\"[^>]*content=\"([^\"]+)\"/)||[])[1];
                  const ttl = (ht.match(/property=\"og:title\"[^>]*content=\"([^\"]+)\"/)||[])[1] || '';
                  let stamp = null;
                  const m1 = ht.match(/"taken_at":\s*(\d+)/);
                  const m2 = ht.match(/"datePublished":"([^"]+)"/);
                  const m3 = ht.match(/"upload_date":"([^"]+)"/);
                  if (m1) stamp = new Date(Number(m1[1])*1000).toISOString();
                  else if (m2) stamp = new Date(m2[1]).toISOString();
                  else if (m3) stamp = new Date(m3[1]).toISOString();
                  if (img) nested.push({ id: 'oembed:'+url, caption: ttl, media_type: 'IMAGE', media_url: img, thumbnail_url: img, permalink: url, timestamp: stamp || new Date().toISOString(), children: [] });
                } catch {}
              }
            } catch {}
          }
        }
        return res.status(200).json({ data: nested });
      }
      return res.status(200).json(j);
    }
    return res.status(500).json({ error: 'Missing token: set INSTAGRAM_TOKEN (Basic Display) or FB_ACCESS_TOKEN + IG_USER_ID (Graph API)' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
