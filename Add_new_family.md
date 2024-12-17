# Steps to create an entry for a new family

To add a multi-spec repository:

- Clone the `./src/lib/epub_data.ts` file and modify it accordingly
- Clone the `./src/epub.ts` file, and modify it by importing the file from the previous step, instead of `epub_data.ts`
- Clone the `./src/browser_epub.ts` file, and modify it by importing the file from the previous step, instead of `epub_data.ts`
- Clone the `./docs/epub.html` file, and modify it by listing the new entries
- (Optional) add tasks to `deno.json` to include the new family
