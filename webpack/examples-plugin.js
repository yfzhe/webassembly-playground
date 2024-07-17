import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import VirtualModulesPlugin from "webpack-virtual-modules";

// TODO: watch /examples directory

const SOURCE_PATH = "./src/examples";
const TARGET_PATH = "./src/examples/index.json";

function isExampleFile(filename) {
  return [".wat", ".js"].includes(extname(filename));
}

async function generateExamples() {
  const examples = [];

  for (const subpath of await readdir(SOURCE_PATH)) {
    const subdir = resolve(SOURCE_PATH, subpath);
    const stat = await lstat(subdir);

    if (!stat.isDirectory()) continue;

    const filenames = await readdir(subdir);
    const files = await Promise.all(
      filenames.filter(isExampleFile).map(async (filename) => ({
        filename,
        content: await readFile(resolve(subdir, filename), "utf-8"),
      })),
    );

    examples.push({ title: subpath, files });
  }

  return examples;
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
