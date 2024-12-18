# Steps to create an entry for a new family

To add a multi-spec ("family") repository:

- Clone the `./src/lib/epub_data.ts` file and modify it to adapt to the new family of specification
- Modify the `./src/lib/multiple_data.ts` file by importing the newly created file
- Clone the `./docs/epub.html` file, and modify it by listing the new entries (and, optionally, rename the file)
