import { readFileSync } from "fs";
import { StorybookConfig } from "@storybook/react-webpack5";

const config: StorybookConfig = {
  experimental_indexers: [
    {
      test: /stories.js$/,
      index: async (fileName: string) => {
        const code = readFileSync(fileName, { encoding: "utf-8" });
        const lines = code.trim().split("\n").reverse();
        const exportNames: Array<string> = [];
        for (const line of lines) {
          if (line.startsWith("//#")) continue;
          if (!line.includes("Object.defineProperty")) break;
          const match = line.match(
            /Object\.defineProperty\([^,]+,\s*"([^"]+)",/,
          );
          if (!match) {
            console.error(`Failed to parse CLJS export "${line}"`);
            continue;
          }
          const exportName = match[1];

          if (!exportName.endsWith("default")) {
            console.error(`FILE NAME  "${fileName}"`);
            console.error(`EXPORT NAME  "${exportName}"`);
            console.error(` NAME  "${exportName.replace(/^book_/, "")}"`);

            exportNames.push(exportName);
          }
        }

        return exportNames.reverse().map((exportName) => ({
          type: "story",
          importPath: fileName,
          // title: '', // auto generated from importPath if undefined
          exportName,
          name: exportName.replace(/^book_/, ""),
        }));
      },
    },
  ],
  stories: ["../public/js/stories/*stories.js"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials"],
  framework: {
    name: "@storybook/react-webpack5",
    options: {
      builder: {
        fsCache: true,
        lazyCompilation: true
      }
    }
  },
  features: {
    // https://github.com/storybookjs/storybook/issues/21703#issuecomment-1517276207
    storyStoreV7: false, // 👈 Opt out of on-demand story loading
  },
  docs: {
    autodocs: "tag",
  },
};
export default config;