# Preview for text PR-s

Simple tool to create a preview and an HTML diff URLs for GitHub PRs that aim at pure HTML documents or documents that
are written using the [ReSpec](https://github.com/w3c/respec/wiki) tool. There is a GitHub App service called “PR Preview”, but it may be down. This
tool is a simpler version that can help editors and users to add references to the PR comments when the main
“PR Preview” App is down.

The tool can be downloaded a command line interface or used directly from a [Web page](https://iherman.github.io/preview/) that runs the tool in
the client. In both cases the tool needs the URL of the PR, and provides a small markdown snippet that can be put
verbatim into a GitHub comment. Note that the generic setup relies on the assumption that the "main" file to be
previewed is called `index.html` on the top level. The tool can be adapted to special setups, too, see the EPUB
alternative below.

## Generic case

### CLI Installation

The tool is written in Typescript and in runs with [`deno`](https://deno.land).

Once the repository is cloned/downloaded, running, you can run

```sh
deno run src/main.ts --help
```

to get simple information on how to run the service.

### Web module installation

To generate a new version of the javascript modules, imported by the HTML interface, run

```sh
deno task generic
```

which installs the `docs/assets/js/preview.js`. That is used by the HTML interface in `docs/index.html` or,
on the Web, in https://iherman.github.io/preview/. 

## Multi-document repositories, a.k.a. "family" of recommendation

The generic case is prepared to the situation where the "main" file to be
previewed is called `index.html` on the top level. In other words, it reflects the "one repository —one document" 
model. However, there are cases where _one_ repository is used for many documents in parallel; this is the case,
for example, of the [EPUB 3 Recommendation repository](https://github.com/w3c/epub-specs/), which is used for the parallel
development of numerous documents. The difference is that the exact path for each document must be re-used to 
generate the final URLs. 

(Note that this is the case where the GitHub "PR preview" application also fails. In other words, for the development of
EPUB, this tool _is the only_ one that can be used to put preview statements in the PR comments.)

The library is prepared for the "family" case, the current dataset is centered around EPUB. The CLI is:

```sh
deno run src/family.ts --help
```

The Web module can be installed by

```sh
deno task family
```

which installs the `docs/assets/js/preview_family.js`. That is used by the HTML interface in `docs/epub.html`
in the current setup (the name can be adapted), on the Web, in https://iherman.github.io/preview/epub.html.

### Change families

To install a different family of recommendations:

- Clone the `./src/lib/epub_data.ts` file and modify it to match the new family of specification
- Modify the `./src/lib/multiple_data.ts` file by importing the newly created file
- Optionally, rename the `./docs/epub.html` file to something more appropriate for the family

## Notes

Note that it is a poor man's solution compared to “PR Preview” App, and may still evolve the coming few days. 
The biggest issue is that the diff is slow: it converts both the original and the new version via ReSpec on the fly 
before creating a diff. A full service would do some sort of caching somewhere to make it more efficient.


