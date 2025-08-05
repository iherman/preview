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

The tool is written in Typescript and in runs with [`deno`](https://deno.land).

## Local use with a cloned repository

### Generic case

#### CLI Installation

Once the repository is cloned/downloaded, you can run

```sh
deno run src/main.ts [PR URL]
```

to get simple information on how to run the service. Look at `--help` for other options.

#### Web module installation

To generate a new version of the javascript version, to be imported by the HTML interface, run

```sh
deno task generic
```

which installs the `docs/assets/js/preview.js`. That is used by the HTML interface in `docs/index.html` or,
on the Web, in https://iherman.github.io/preview/. 

### Multi-document repositories, a.k.a. "family" of recommendation

The generic case is prepared to the situation where the "main" file to be
previewed is called `index.html` on the top level. In other words, it reflects the "one repository — one document" 
model. However, there are cases where _one_ repository is used for many documents in parallel; this is the case,
for example, of the [EPUB 3 Recommendation repository](https://github.com/w3c/epub-specs/), which is used for the parallel
development of numerous documents. The difference is that the exact path for each document must be known and used to 
generate the final URLs. 

(Note that this is the case where the GitHub "PR preview" application also fails. In other words, for the development of
EPUB, this tool _is the only_ one that can be used to put preview statements in the PR comments.)

The library is prepared for the "family" case. The CLI is:

```sh
deno run src/family.ts --family familyID [PR number]
```

Where `familyID` identifies the family as whole in a specific data file (see below). It currently defaults to `epub`.

The javascript version, usable from a browser, can be installed by

```sh
deno task family
```

which installs the `docs/assets/js/preview_family.js`. It is used by the HTML interface `docs/epub.html`
in the current setup, or, on the Web, in https://iherman.github.io/preview/epub.html. The family ID has to be set
via a data attribute on the `<html>` element, which should include the `data-preview` attribute, whose value is the ID.
In other words, the HTML file looks as follows:

```html
<!doctype html>
<html data-preview="epub">
    <head>
        …
    </head>
    <body>
        …
    </body>
</html>
```



#### Change/add families

To install a different family of recommendations:

- Clone the `./src/lib/epub_data.ts` file and modify it to match the new family of specification. The `id` field in the data is used in the command line and/or as the value of the data attribute for HTML.
- Modify the `./src/lib/multiple_data.ts` file by importing the newly created module, and add its reference to the `family` array.
- Optionally, copy or rename the `./docs/epub.html` file to something more appropriate for the family; modify the `data-preview` attribute to refer to the new family

## Doing everything remotely

If the only goal is to _use_ the tool and not, possibly, modify it, there is no need to clone the repository. The CLI can be activated via `jsr` directly:

```sh
deno run jsr:@iherman/preview/cli [PR URL]
```

for the generic case, and

```sh
deno run jsr:@iherman/preview/family --family familyID [PR number]
```

for the family case, respectively.

As for the HTML on a local browser (or on another server), the HTML file can as follows


```html
<!doctype html>
<html data-preview="familyID">
    <head>
        …
        <link rel='stylesheet' href='https://iherman.github.io/preview/assets/css/preview.css'/>
        <script src='https://iherman.github.io/preview/assets/js/preview.js'></script>

    …
</html>
```

(The javascript file has been minimized and is small. No reason the bother with a CDN.)

## Notes

Note that it is a poor man's solution compared to “PR Preview” App, and may still evolve. The biggest issue is that the generated diff URL is slow to load: it converts both the original and the new versions via ReSpec on the fly before creating a diff. A full service would do some sort of caching somewhere to make it more efficient.
