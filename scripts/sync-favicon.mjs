import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const logo = resolve(root, 'src/assets/logo.png');
const favicon = resolve(root, 'public/favicon.png');

mkdirSync(dirname(favicon), { recursive: true });
copyFileSync(logo, favicon);
console.log('Synced favicon from src/assets/logo.png → public/favicon.png');
