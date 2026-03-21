-- This script will generate 10 mock articles and assign them to your first user account

DO $$
DECLARE
  first_user_id UUID;
BEGIN
  -- 1. Grab the first available user ID from the profiles table to act as the author
  SELECT user_id INTO first_user_id FROM public.profiles LIMIT 1;

  -- Safety check
  IF first_user_id IS NULL THEN
    RAISE EXCEPTION 'No users found in the database. Please create an account via the signup page first before running this script.';
  END IF;

  -- 2. Insert the mock articles
  INSERT INTO public.articles (title, slug, excerpt, content, cover_image, category, tags, status, author_id, read_time_minutes, is_featured) 
  VALUES
  (
    'The Rise of AI-Native Development',
    'rise-of-ai-native-development-' || floor(random() * 1000)::text,
    'How artificial intelligence is reshaping the way we build software.',
    '<h2>The Shift in Paradigm</h2><p>In the past year, AI-native development has moved from being just a buzzword to a practical reality that developers deal with every single day...</p><h3>Code Generation</h3><p>Tools like GitHub Copilot and Cursor are radically changing the speed at which we implement standard boilerplate...</p>',
    'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1000',
    'Technology',
    ARRAY['AI', 'Development', 'Future'],
    'published',
    first_user_id,
    6,
    true
  ),
  (
    'Why Every Developer Should Understand System Design',
    'why-developers-need-system-design-' || floor(random() * 1000)::text,
    'Moving beyond algorithms and truly understanding how massive applications scale.',
    '<p>System design is often viewed merely as an obstacle for passing Senior Engineering interviews. However, understanding how microservices, load balancers, and databases interact at scale is essential for writing robust, future-proof code on a daily basis.</p>',
    'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
    'Programming',
    ARRAY['System Design', 'Architecture', 'Scaling'],
    'published',
    first_user_id,
    8,
    false
  ),
  (
    'Top 10 VS Code Extensions You Need in 2026',
    'top-vscode-extensions-' || floor(random() * 1000)::text,
    'Boost your productivity with these must-have modern extensions.',
    '<h2>Turbocharge your Editor</h2><p>VS Code continues to dominate the IDE space. Here are the top 10 extensions that will completely transform your workflow this year, ranging from AI sidekicks to advanced Git visualizations...</p>',
    'https://images.unsplash.com/photo-1627398246734-ec9cabe500c5?auto=format&fit=crop&q=80&w=1000',
    'Tools',
    ARRAY['VS Code', 'Productivity', 'Setup'],
    'published',
    first_user_id,
    4,
    false
  ),
  (
    'From Dorm Room to $10M ARR: A Student Startup Story',
    'dorm-room-startup-story-' || floor(random() * 1000)::text,
    'How two college dropouts built a dominating SaaS product in 18 months.',
    '<p>Starting a business in college is hard. Scaling it to $10M Annual Recurring Revenue while sitting in a dorm room is nearly impossible. Here is an exclusive deep dive into how they achieved it without taking any traditional venture capital.</p>',
    'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000',
    'Startups',
    ARRAY['Startup', 'SaaS', 'Business'],
    'published',
    first_user_id,
    12,
    true
  ),
  (
    'Understanding React Server Components',
    'react-server-components-guide-' || floor(random() * 1000)::text,
    'Demystifying the biggest change to the React ecosystem since Hooks.',
    '<h2>The End of the SPA?</h2><p>React Server Components (RSC) fundamentally shift how and where our UI renders. By keeping heavy libraries and database queries exclusively on the server, we ship zero JavaScript to the client for entirely static structural components.</p>',
    'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1000',
    'Web Development',
    ARRAY['React', 'Frontend', 'JavaScript'],
    'published',
    first_user_id,
    7,
    false
  ),
  (
    'The Future of Open Source in the AI Era',
    'open-source-in-ai-era-' || floor(random() * 1000)::text,
    'How open-source communities are fighting back against closed AI ecosystems.',
    '<p>As massive corporations lock down their foundational models and APIs behind paywalls, the open-source community provides a vital counter-balance. We explore how projects like LLaMA and Hugging Face are democratizing access to powerful intelligence tools.</p>',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1000',
    'Technology',
    ARRAY['Open Source', 'AI', 'Community'],
    'published',
    first_user_id,
    5,
    false
  ),
  (
    'Mastering Tailwind CSS for Rapid UI Development',
    'mastering-tailwind-css-' || floor(random() * 1000)::text,
    'Stop fighting with semantic class names and embrace utility-first styling.',
    '<h2>The Utility-First Approach</h2><p>Tailwind CSS has officially won the styling wars. Learn how to leverage arbitrary values, create custom utility themes, and build incredibly responsive grid layouts in seconds rather than hours.</p>',
    'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000',
    'Web Development',
    ARRAY['CSS', 'Tailwind', 'Design'],
    'published',
    first_user_id,
    6,
    false
  ),
  (
    'How to Avoid Burnout as a Remote Worker',
    'avoiding-remote-burnout-' || floor(random() * 1000)::text,
    'Practical strategies for separating your work life from your home life.',
    '<p>When your office is three feet away from your bed, turning off "work mode" becomes incredibly difficult. Here are tested strategies from remote veterans on maintaining mental health...</p>',
    'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=1000',
    'Productivity',
    ARRAY['Remote Work', 'Health', 'Mental Health'],
    'draft', -- Keeping this one as a Draft
    first_user_id,
    4,
    false
  ),
  (
    'The State of Web3 in Post-Hype 2026',
    'state-of-web3-2026-' || floor(random() * 1000)::text,
    'What survived the crash, and what is actually being used by real people today.',
    '<p>The crypto winter washed away the purely speculative projects. What remains is a quiet, steady build of truly decentralized infrastructure. Let us look at what Web3 technologies are actually providing value today.</p>',
    'https://images.unsplash.com/photo-1639762681485-074b7f43dbf6?auto=format&fit=crop&q=80&w=1000',
    'Technology',
    ARRAY['Web3', 'Blockchain', 'Crypto'],
    'pending', -- Keeping this one as Pending Approval
    first_user_id,
    8,
    false
  ),
  (
    'Essential CI/CD Pipelines for Modern Apps',
    'essential-cicd-pipelines-' || floor(random() * 1000)::text,
    'Automate your deployments and stop worrying about "breaking production".',
    '<h2>Deploy with Confidence</h2><p>Manual deployments are a relic of the past. If you are not using GitHub Actions or GitLab CI to automatically test, lint, and deploy your code on every merge to main, you are leaving massive amounts of free productivity on the table.</p>',
    'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&q=80&w=1000',
    'DevOps',
    ARRAY['CI/CD', 'DevOps', 'Automation'],
    'published',
    first_user_id,
    5,
    false
  );

END $$;
