import * as esbuild    from "https://deno.land/x/esbuild@v0.24.0/mod.js";
import { denoPlugins } from "https://deno.land/x/esbuild_deno_loader@0.9.0/mod.ts";

await esbuild.build({
    entryPoints: ["./src/browser_family.ts"], // Replace with your entry file
    outfile: "./docs/assets/js/preview_family.js", // Output file
    bundle: true,
    format: "esm", // Output format
    platform: "browser", // Target platform
    target: "esnext", // JavaScript version target
    minify: false, // Minify the output
    sourcemap: false, // Generate source maps
    plugins: [...denoPlugins()], // Use Deno plugins for module resolution
});

console.log("Generated family browser plugin");
esbuild.stop();
