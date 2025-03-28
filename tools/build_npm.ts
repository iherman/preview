import { build, emptyDir } from "jsr:@deno/dnt";

const deno_json = JSON.parse(Deno.readTextFileSync("deno.json"));

await emptyDir("./.npm");

await build({
    entryPoints: ["./src/main.ts", "./src/family.ts"],
    outDir: "./.npm",
    shims: {
        // see JS docs for overview and more options
        deno: true,
    },
    importMap: "deno.json",
    package: {
        // package.json properties
        name: deno_json.name,
        version: deno_json.version,
        date: deno_json.date,
        description: deno_json.description,
        license: deno_json.license,
        author: deno_json.author,
        repository: {
            type: "git",
            url: "git+https://github.com/iherman/preview.git",
        },
        bugs: {
            url: "https://github.com/iherman/preview/issues",
        },
    },
    postBuild() {
        // steps to run after building and before running the tests
        Deno.copyFileSync("LICENSE.md", ".npm/LICENSE.md");
        Deno.copyFileSync("README.md", ".npm/README.md");
    },
});
