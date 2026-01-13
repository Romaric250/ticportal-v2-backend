import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distDir = path.join(__dirname, '../dist');

function addJsExtensions(dir) {
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      addJsExtensions(filePath);
    } else if (file.endsWith('.js')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix relative imports
      content = content.replace(
        /from\s+["'](\..+?)["']/g,
        (match, importPath) => {
          if (!importPath.endsWith('.js')) {
            return `from "${importPath}.js"`;
          }
          return match;
        }
      );
      
      // Fix require statements if any
      content = content.replace(
        /require\(["'](\..+?)["']\)/g,
        (match, importPath) => {
          if (!importPath.endsWith('.js')) {
            return `require("${importPath}.js")`;
          }
          return match;
        }
      );

      fs.writeFileSync(filePath, content);
    }
  });
}

console.log('Adding .js extensions to imports...');
addJsExtensions(distDir);
console.log('✅ Fixed all imports!');
