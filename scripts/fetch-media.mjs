// 抓取电影海报与剧照（一次性素材准备脚本）
// 仅用于本项目本地演示素材，版权归各电影公司所有。
import { writeFile, mkdir, readFile, access } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

const FILMS = [
  ['interstellar', 'interstellar'],
  ['inception', 'inception'],
  ['shawshank', 'the-shawshank-redemption'],
  ['godfather', 'the-godfather'],
  ['spirited-away', 'spirited-away'],
  ['your-name', 'your-name'],
  ['la-la-land', 'la-la-land'],
  ['grand-budapest', 'the-grand-budapest-hotel'],
  ['blade-runner-2049', 'blade-runner-2049'],
  ['dune', 'dune-2021'],
  ['dune-2', 'dune-part-two'],
  ['oppenheimer', 'oppenheimer-2023'],
  ['barbie', 'barbie'],
  ['eeaao', 'everything-everywhere-all-at-once'],
  ['parasite', 'parasite-2019'],
  ['joker', 'joker-2019'],
  ['zootopia', 'zootopia'],
  ['spider-verse', 'spider-man-into-the-spider-verse'],
  ['farewell-concubine', 'farewell-my-concubine'],
  ['infernal-affairs', 'infernal-affairs'],
  ['bullets-fly', 'let-the-bullets-fly'],
  ['crouching-tiger', 'crouching-tiger-hidden-dragon'],
  ['mood-for-love', 'in-the-mood-for-love'],
  ['happy-together', 'happy-together-1997'],
  ['yi-yi', 'yi-yi'],
  ['1900', 'the-legend-of-1900'],
  ['life-is-beautiful', 'life-is-beautiful'],
  ['truman-show', 'the-truman-show'],
  ['fight-club', 'fight-club'],
  ['dark-knight', 'the-dark-knight'],
  ['lotr-return', 'the-lord-of-the-rings-the-return-of-the-king'],
  ['harry-potter-1', 'harry-potter-and-the-philosophers-stone'],
  ['star-wars', 'star-wars-1977'],
  ['2001', '2001-a-space-odyssey'],
  ['blade-runner', 'blade-runner'],
  ['alien', 'alien'],
  ['shining', 'the-shining'],
  ['se7en', 'se7en'],
  ['silence-lambs', 'the-silence-of-the-lambs'],
  ['memento', 'memento'],
  ['invisible-guest', 'the-invisible-guest'],
  ['psycho', 'psycho'],
  ['titanic', 'titanic-1997'],
  ['roman-holiday', 'roman-holiday'],
  ['before-sunrise', 'before-sunrise'],
  ['cmbyn', 'call-me-by-your-name'],
  ['soul', 'soul-2020'],
  ['heidi', 'heidi-2015'],
  ['little-forest', 'little-forest'],
  ['walter-mitty', 'the-secret-life-of-walter-mitty-2013'],
  ['into-the-wild', 'into-the-wild'],
  ['forrest-gump', 'forrest-gump'],
  ['fury-road', 'mad-max-fury-road'],
  ['john-wick', 'john-wick'],
  ['mi-fallout', 'mission-impossible-fallout'],
  ['top-gun-maverick', 'top-gun-maverick'],
  ['spider-verse-2', 'spider-man-across-the-spider-verse'],
  ['ne-zha', 'ne-zha'],
  ['wandering-earth', 'the-wandering-earth'],
  ['chungking-express', 'chungking-express'],
  ['eternal-sunshine', 'eternal-sunshine-of-the-spotless-mind'],
  ['arrival', 'arrival-2016'],
  ['silent-voice', 'a-silent-voice-the-movie'],
  ['catch-me', 'catch-me-if-you-can-2002'],
  ['witness', 'witness-for-the-prosecution-1957'],
];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const exists = async (p) =>
  access(p).then(
    () => true,
    () => false
  );

async function get(url, tries = 4) {
  for (let i = 0; i < tries; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'en-US,en;q=0.9' },
      });
      if (res.ok) return res;
      if (res.status === 404) return null;
    } catch {
      /* retry */
    }
    await sleep(1500 * (i + 1));
  }
  return null;
}

async function main() {
  await mkdir(path.join(ROOT, 'public/media/posters'), { recursive: true });
  await mkdir(path.join(ROOT, 'public/media/backdrops'), { recursive: true });
  let store = { manifest: {}, failed: [] };
  try {
    store = JSON.parse(await readFile(path.join(ROOT, 'scripts/manifest.json'), 'utf8'));
  } catch {
    /* first run */
  }
  const { manifest } = store;
  const failed = [];

  for (const [id, slug] of FILMS) {
    const pPoster = path.join(ROOT, 'public/media/posters', `${id}.jpg`);
    const pBack = path.join(ROOT, 'public/media/backdrops', `${id}.jpg`);
    if ((await exists(pPoster)) && (await exists(pBack)) && manifest[id]) {
      continue;
    }
    const page = await get(`https://letterboxd.com/film/${slug}/`);
    if (!page) {
      failed.push({ id, slug, why: 'page' });
      console.log('✗', id, 'page');
      continue;
    }
    const html = await page.text();
    const titleTag = (html.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
    const cleanTitle = titleTag.replace('&lrm;', '').split(' directed by')[0].trim();
    const yearMatch = cleanTitle.match(/\((\d{4})\)/);

    const backdrop = (html.match(/data-backdrop="(https:\/\/a\.ltrbxd\.com[^"]+)"/) || [])[1];
    const posterRaw =
      (html.match(/https:\/\/a\.ltrbxd\.com\/resized\/film-poster\/[^"?'\s]+/) || [])[0] ||
      (html.match(/"image":"(https:\/\/a\.ltrbxd\.com[^"]+)"/) || [])[1];
    if (!backdrop || !posterRaw) {
      failed.push({ id, slug, why: 'assets' });
      console.log('✗', id, 'assets');
      continue;
    }
    const poster = posterRaw.replace(/-0-\d+-0-\d+-crop\.jpg$/, '-0-500-0-750-crop.jpg');

    const [pj, bj] = [await get(poster), await get(backdrop)];
    if (!pj || !bj) {
      failed.push({ id, slug, why: 'download' });
      console.log('✗', id, 'download');
      continue;
    }
    await writeFile(pPoster, Buffer.from(await pj.arrayBuffer()));
    await writeFile(pBack, Buffer.from(await bj.arrayBuffer()));
    manifest[id] = { slug, title: cleanTitle, year: yearMatch ? yearMatch[1] : null };
    console.log('✓', id, '|', cleanTitle);
    await sleep(500);
  }

  await writeFile(
    path.join(ROOT, 'scripts/manifest.json'),
    JSON.stringify({ manifest, failed }, null, 2)
  );
  console.log('\nDONE, failed:', failed.length ? JSON.stringify(failed) : 'none');
}

main();
