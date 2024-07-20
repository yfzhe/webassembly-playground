import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import VirtualModulesPlugin from "webpack-virtual-modules";

// TODO: watch /examples directory

const SOURCE_PATH = "./src/examples";
const TARGET_PATH = "./src/examples/index.json";

async function generateExamples() {
  const subdirs = await readdir(SOURCE_PATH);
  const examples = await Promise.all(subdirs.map(generateExample));
  return examples.filter(Boolean);
}

async function generateExample(dir) {
  const path = resolve(SOURCE_PATH, dir);

  const stat = await lstat(path);
  if (!stat.isDirectory()) return null;

  const filenames = await readdir(path);
  const wats = await extractFiles(path, filenames, ".wat");
  const jss = await extractFiles(path, filenames, ".js");
  return { title: dir, files: wats.concat(jss) };
}

function extractFiles(basePath, files, ext) {
  return Promise.all(
    files
      .filter((f) => extname(f) === ext)
      .map(async (filename) => ({
        filename,
        content: await readFile(resolve(basePath, filename), "utf-8"),
      })),
  );
}

class ExamplesPlugin {
  /**
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    const virtual = new VirtualModulesPlugin();
    virtual.apply(compiler);

    compiler.hooks.compilation.tap("ExamplesPlugin", async (compilation) => {
      const examples = await generateExamples();
      virtual.writeModule(TARGET_PATH, JSON.stringify(examples));
    });
  }
}

export default ExamplesPlugin;
