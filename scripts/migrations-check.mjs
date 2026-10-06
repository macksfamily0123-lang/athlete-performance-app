import fs from 'node:fs';import crypto from 'node:crypto';import assert from 'node:assert/strict';
const rows=fs.readFileSync('supabase/migrations.sha256','utf8').trim().split('\n');
assert.equal(rows.length,16,'all 16 baseline migrations are present');
for(const row of rows){const [expected,path]=row.split('  ');assert.equal(crypto.createHash('sha256').update(fs.readFileSync(path)).digest('hex'),expected,`baseline migration changed: ${path}`)}
console.log('RC66 migrations 001–016 preserved (16/16 SHA-256 checks).');
