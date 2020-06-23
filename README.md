# Preview for text PR-s

Simple tool to create a preview and an HTML diff URLs for Github PR that aim at pure HTML documents or documents that are written using the [ReSpec](https://github.com/w3c/respec/wiki) tool. There is a GitHub App service called “PR Preview”, but it is a bit fragile and is often down. This tool is a simpler version that can help editors and users to add references to the PR comments when the main “PR Preview” App is down.

The tool can be downloaded and installed via standard `npm` and use a command line interface or used directly from a [Web page](https://iherman.github.io/preview/) that runs the tool in the client. In both cases the tool needs the URL of the PR, and provides a small markdown snippet that can be put verbatim into a github comment.

## CLI Installation

The tool is based on `node.js` (the source itself is written in Typescript); you need at least `node.js` to run it (and `npm` to install it).

Once the repository is cloned/downloaded, running

```sh
npm install
```

installs everything necessary. You can run

```
node dist/main.js --help
```

to get a simple information on how to run the service.

## Notes

Note that it is a poor man's solution compared to “PR Preview” App, and may still evolve the coming few days. The biggest issue is that the diff is slow: it converts both the original and the new version via ReSpec on the fly before creating a diff. A full service would do some sort of caching somewhere to make it more efficient.


