import { lstat, readdir, readFile } from "node:fs/promises";
import { extname, resolve } from "node:path";
import VirtualModulesPlugin from "webpack-virtual-modules";

// TODO: watch /examples directory

async function generateExamples(source) {
  const subdirs = await readdir(source);
  const examples = await Promise.all(
    subdirs.map((dir) => generateExample(source, dir)),
  );
  return examples.filter(Boolean).sort((a, b) => a.index - b.index);
}

async function generateExample(source, dir) {
  const path = resolve(source, dir);

  const stat = await lstat(path);
  if (!stat.isDirectory()) return null;

  const matched = /^(\d+)-(.+)$/.exec(dir);
  if (!matched)
    throw new Error(
      `directory's name doesn't follow the schema \`42-title\`: ${dir}`,
    );
  const [_, index, title] = matched;

  const filenames = await readdir(path);
  const wats = await extractFiles(path, filenames, ".wat");
  const jss = await extractFiles(path, filenames, ".js");
  const metadata = await extractMetadata(path);

  return {
    index: parseInt(index),
    title: metadata?.title ?? title,
    files: wats.concat(jss),
    features: metadata?.features,
  };
}

async function extractFiles(basePath, files, ext) {
  return Promise.all(
    files
      .filter((f) => extname(f) === ext)
      .map(async (filename) => ({
        filename,
        content: await readFile(resolve(basePath, filename), "utf-8"),
      })),
  );
}

async function extractMetadata(basePath) {
  try {
    const json = await readFile(resolve(basePath, "metadata.json"), "utf-8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

class ExamplesPlugin {
  constructor({ source, target }) {
    this.source = source;
    this.target = target;
  }

  /**
   * @param {import("webpack").Compiler} compiler
   */
  apply(compiler) {
    const sourcePath = resolve(compiler.context, this.source);
    const targetPath = resolve(compiler.context, this.target);

    const virtual = new VirtualModulesPlugin();
    virtual.apply(compiler);

    compiler.hooks.compilation.tap("ExamplesPlugin", async (compilation) => {
      const examples = await generateExamples(sourcePath);
      virtual.writeModule(targetPath, JSON.stringify(examples));
    });
  }
}

export default ExamplesPlugin;
