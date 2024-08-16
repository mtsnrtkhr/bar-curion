import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '..', 'public', 'data');
const targetDir = path.join(__dirname, '..', 'out', 'data');

fs.copy(sourceDir, targetDir, { overwrite: true })
  .then(() => console.log('Copy completed!'))
  .catch(err => console.error('An error occurred while copying the folder.', err));