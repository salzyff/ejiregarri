import { access } from 'node:fs/promises';
for (const file of ['dist/index.html', 'dist/styles.css', 'dist/artwork.css', 'dist/app.js', 'dist/config.js', 'dist/assets/favicon.svg']) await access(file);
console.log('Build complete: static website is ready in dist/.');
