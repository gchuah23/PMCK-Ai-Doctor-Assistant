import fs from 'node:fs';
import path from 'node:path';
import fetch from 'node-fetch';
import * as cheerio from 'cheerio';

type DoctorRecord = {
  id: string;
  name: string;
  specialty: string;
  bio: string;
  imageUrl: string;
  profileUrl: string;
};

/**
 * Convert a doctor's name into a URL‑friendly slug. This removes any honourifics
 * and punctuation, lowercases the result and replaces non‑alphanumeric
 * characters with hyphens.
 */
const slugify = (name: string): string => {
  return name
    .replace(/^Dr\.?\s*/i, '')
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[’'`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// The URL for the PMCK doctors directory. If the site structure changes,
// update this value or adjust the selectors in parseDoctors().
const SRC = 'https://pmck.com.my/doctors/';

/**
 * Parse the HTML and extract doctor records. The page groups doctors by
 * speciality sections with headings and each doctor card begins with a
 * ##### heading. We traverse these elements to build our list.
 */
const parseDoctors = ($: cheerio.CheerioAPI): DoctorRecord[] => {
  const doctors: DoctorRecord[] = [];
  // Keep track of seen slugs to avoid duplicates.
  const seen = new Set<string>();

  // Each doctor name appears in an h5 (# style). We'll iterate through all
  // headings that start with "Dr." and collect details from the following
  // description lists.
  $('h5, h6, h4, h3, h2, h1').each((_, el) => {
    const text = $(el).text().trim();
    if (/^Dr\.\s+/i.test(text)) {
      const name = text;
      const slug = slugify(name);
      if (seen.has(slug)) return;
      seen.add(slug);

      // Try to infer specialty by looking up through previous headings.
      let specialty = '';
      let current = el.parent;
      while (current) {
        const prev = $(current).prevAll('h2,h3,h4,h5,h6').first();
        if (prev.length) {
          specialty = prev.text().trim();
          break;
        }
        current = current.parent;
      }

      // Find profile URL: anchor tags linking to doctor page may exist in the
      // surrounding section.
      let profileUrl = SRC + '#' + slug;
      const link = $(el).find('a[href*="/doctors/"]');
      if (link.length) {
        profileUrl = link.attr('href') || profileUrl;
      }

      // Attempt to extract biography and image from the description below the name.
      // This is heuristic and may need adjustments if the site markup changes.
      let bio = '';
      let imageUrl = '';
      const desc = $(el).nextUntil('h5, h4, h3, h2, h1');
      desc.each((__, d) => {
        const tag = $(d).get(0).tagName;
        if (tag === 'p') {
          const txt = $(d).text().trim();
          if (txt && !bio) bio = txt;
        }
        if (tag === 'img') {
          const src = $(d).attr('src');
          if (src && !imageUrl) imageUrl = src;
        }
      });

      doctors.push({ id: slug, name, specialty, bio, imageUrl, profileUrl });
    }
  });

  return doctors;
};

async function main() {
  const html = await (await fetch(SRC)).text();
  const $ = cheerio.load(html);
  const doctors = parseDoctors($);

  const outPath = path.join(process.cwd(), 'data', 'doctor_list.json');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(doctors, null, 2), 'utf8');
  console.log(`Wrote ${doctors.length} doctors to ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});