import { access } from 'node:fs/promises';
for (const file of ['dist/index.html', 'dist/styles.css', 'dist/app.js', 'dist/config.js', 'dist/assets/favicon.svg', ...['hero','garri','gift','bulk','roots','bowl'].map(name => `dist/assets/${name}-placeholder.svg`)]) await access(file);
console.log('Build complete: static website is ready in dist/.');
