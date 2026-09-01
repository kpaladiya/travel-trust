import { copyFile, mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const sourceDirectory =
  'dist/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts';
const publicDirectory = 'dist/assets/fonts';
const bundleDirectory = 'dist/_expo/static/js';

async function findJavaScriptFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name);

      if (entry.isDirectory()) {
        return findJavaScriptFiles(path);
      }

      return entry.name.endsWith('.js') ? [path] : [];
    })
  );

  return files.flat();
}

const fontFiles = (await readdir(sourceDirectory)).filter((file) => file.endsWith('.ttf'));
const bundleFiles = await findJavaScriptFiles(bundleDirectory);

await mkdir(publicDirectory, { recursive: true });

for (const fontFile of fontFiles) {
  await copyFile(join(sourceDirectory, fontFile), join(publicDirectory, fontFile));
}

let replacements = 0;

for (const bundleFile of bundleFiles) {
  const source = await readFile(bundleFile, 'utf8');
  let output = source;

  for (const fontFile of fontFiles) {
    const sourcePath = `/assets/node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/${fontFile}`;
    const publicPath = `/assets/fonts/${fontFile}`;
    const occurrences = output.split(sourcePath).length - 1;

    if (occurrences > 0) {
      output = output.replaceAll(sourcePath, publicPath);
      replacements += occurrences;
    }
  }

  if (output !== source) {
    await writeFile(bundleFile, output);
  }
}

if (replacements === 0) {
  throw new Error('No Expo vector icon font paths were rewritten.');
}
