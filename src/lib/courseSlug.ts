// Course ka public URL slug — /courses/<slug>.
// Title se derive hota hai, lekin chal rahi courses ki IDs ke liye slug pinned
// hai: admin title edit kare to bhi purani share ki hui URLs (Google, WhatsApp
// links) tooti nahi. Nayi courses ka slug title se apne aap ban jata hai.

const PINNED: Record<string, string> = {
  '7d22dcc9-ad5e-4f57-9a17-e87323ec9e8f': 'crypto-trading-course-beginner',
  '2dd8c5dc-c985-4ea0-86fe-26efb9fc2c95': 'crypto-trading-course-intermediate',
  '651ff86a-1415-44c4-a8d5-d20e894d2b7b': 'crypto-trading-course-advanced',
  'cd799311-4c6a-43e1-a9cd-f1037545f0cf': 'forex-trading-course-beginner',
  'aadebd3f-49a1-4fa0-97e7-34fadef918cf': 'forex-trading-course-intermediate',
  // Master Crypto Trading (Supabase draft — supabase-master-crypto-course.sql)
  '9f3c2b7a-6d51-4c98-b2ae-71d957e84f10': 'master-crypto-trading',
}

export function courseSlugify(title: string): string {
  return title
    .toLowerCase()
    .replace(/\([^)]*\)|\[[^\]]*\]/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function courseSlug(id: string | undefined | null, title: string): string {
  if (id && PINNED[id]) return PINNED[id]
  return courseSlugify(title)
}
