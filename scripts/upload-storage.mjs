import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
const BUCKET = 'storage';
const SOURCE = join(__dirname, '..', 'public', 'storage');

function getAllFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry);
    return statSync(fullPath).isDirectory() ? getAllFiles(fullPath) : [fullPath];
  });
}

function getMimeType(filename) {
  if (filename.endsWith('.webp')) return 'image/webp';
  if (filename.endsWith('.svg'))  return 'image/svg+xml';
  if (filename.endsWith('.png'))  return 'image/png';
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) return 'image/jpeg';
  return 'application/octet-stream';
}

const files = getAllFiles(SOURCE);
console.log(`Found ${files.length} files to upload...\n`);

for (const file of files) {
  const storagePath = relative(SOURCE, file).replace(/\\/g, '/');
  const content = readFileSync(file);

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, content, {
      contentType: getMimeType(file),
      upsert: true,
    });

  if (error) {
    console.error(`✗ ${storagePath} — ${error.message}`);
  } else {
    console.log(`✓ ${storagePath}`);
  }
}

console.log('\nDone!');
