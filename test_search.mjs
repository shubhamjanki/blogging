import 'dotenv/config.js';
const url = `${process.env.VITE_SUPABASE_URL}/rest/v1/articles?select=id,title,status&status=eq.published&or=(title.ilike.*test*,excerpt.ilike.*test*)`;
const res = await fetch(url, { headers: { 'apikey': process.env.VITE_SUPABASE_ANON_KEY }});
console.log("Status:", res.status);
console.log(await res.text());
