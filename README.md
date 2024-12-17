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
ndeno run src/main.ts --help --help
```

to get a simple information on how to run the service.

### Web module installation

To generate a new version of the javascript modules, imported by the HTML interface, run

```sh
deno task generic
```

## Notes

Note that it is a poor man's solution compared to “PR Preview” App, and may still evolve the coming few days. 
The biggest issue is that the diff is slow: it converts both the original and the new version via ReSpec on the fly 
before creating a diff. A full service would do some sort of caching somewhere to make it more efficient.


