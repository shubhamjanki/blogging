import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function testSearch(query) {
  console.log(`Searching for: ${query}`);
  const { data, error } = await supabase
    .from("articles")
    .select("id, title, slug, category, excerpt")
    .eq("status", "published")
    .or(`title.ilike.%${query}%,excerpt.ilike.%${query}%,category.ilike.%${query}%`)
    .limit(8);

  console.log("Error:", error?.message);
  console.log("Data length:", data?.length);
  if (data?.length) {
    console.log("First result:", data[0].title);
  }
}

testSearch("startup").then(() => testSearch("top"));
