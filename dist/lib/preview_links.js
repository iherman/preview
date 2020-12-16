"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.get_data = exports.constants = void 0;
/* eslint-disable @typescript-eslint/no-namespace */
var constants;
(function (constants) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const statically = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/{file}';
    const githack = 'https://raw.githack.com/{owner}/{repo}/{branch}/{file}';
    constants.new_version = statically;
    // export const new_version = githack;
    constants.old_version = 'https://{owner}.github.io/{repo}/{file}';
    constants.gh_api = 'https://api.github.com/repos/{owner}/{repo}/pulls/{number}';
    constants.html_diff = 'https://services.w3.org/htmldiff?doc1={old}&doc2={new}';
    constants.spec_gen = 'https://labs.w3.org/spec-generator/?type=respec&url={url}';
    constants.markdown = `
See:

* [Preview]({preview})
* [Diff]({diff})
`;
    /**
     * Flag to decide whether the code runs in a browser or in node.js
     */
    constants.is_browser = (process === undefined || process.title === 'browser');
})(constants = exports.constants || (exports.constants = {}));
/* ======================================= Interface to Fetch ========================= */
const node_fetch = __importStar(require("node-fetch"));
/**
 * The effective fetch implementation run by the rest of the code.
 *
 * There is no default fetch implementation for `node.js`, hence the necessity to import 'node-fetch'. However, if the code
 * runs in a browser, there is an error message whereby only the fetch implementation in the Window is acceptable.
 *
 * This variable is a simple, polyfill like switch between the two, relying on the existence (or not) of the
 * `process` variable (built-in for `node.js`).
 *
 */
const my_fetch = constants.is_browser ? fetch : node_fetch.default;
/**
 * Generate all the URLs based on the JSON data of the PR. That JSON data is the one
 * returned by the Github API
 *
 * @param main_repo - identification of the main repo, ie, the target of the PR
 * @param octocat - the data returned by the Github API for the PR
 * @param respec - whether the sources are to be encapsulated into a spec generator call for respec in the html diff
 * @param path - the path of the file to be converted
 */
function get_urls(main_repo, octocat, respec, path = 'index.html') {
    /**
    * The URL used in the spec generator must be percent encoded
    */
    const encodeurl = (url) => {
        return url.replace(/\?/g, '%3F').replace(/\&/g, '%26');
    };
    // Get the data for the repository of the submission
    const head_repo = octocat.head.repo.full_name.split('/');
    const submission_repo = {
        owner: head_repo[0],
        repo: head_repo[1],
    };
    // Get the data for the submission branch
    const submission_branch = {
        branch: octocat.head.ref,
    };
    // Get the new version's URL
    const new_version = constants.new_version
        .replace('{owner}', submission_repo.owner)
        .replace('{repo}', submission_repo.repo)
        .replace('{branch}', submission_branch.branch)
        .replace('{file}', path);
    // Get the original versions' URL (used for the diff)
    const old_version = constants.old_version
        .replace('{owner}', main_repo.owner)
        .replace('{repo}', main_repo.repo)
        .replace('{file}', path);
    // If we the sources are in ReSpec, the URLs used in the HTML diff must be a call out to the spec generator
    // to generate the final HTML on the fly. Note that the URLs must be percent encoded.
    const new_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', new_version)) : new_version;
    const old_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', old_version)) : old_version;
    return {
        new: new_version,
        diff: constants.html_diff.replace('{old}', old_spec).replace('{new}', new_spec)
    };
}
/**
 * Get the preview and html diff URLs for a PR.
 *
 * @async
 * @param url - URL of the PR
 * @param respec - Flag whether the documents are in ReSpec, ie, should be converted before establish the diffs
 */
async function get_data(url, respec = true, paths = ['index.html']) {
    /**
     *
     * The standard idiom to get JSON data via fetch
     * @async
     */
    const fetch_json = async (resource_url) => {
        const response = await my_fetch(resource_url);
        return await response.json();
    };
    // The URL for the PR.
    const parsed_path = new URL(url).pathname.split('/');
    const home_repo = {
        owner: parsed_path[1],
        repo: parsed_path[2],
    };
    const pr_number = parsed_path[4];
    const gh_api_url = constants.gh_api
        .replace('{owner}', home_repo.owner)
        .replace('{repo}', home_repo.repo)
        .replace('{number}', pr_number);
    const octocat = await fetch_json(gh_api_url);
    return paths.map((path) => get_urls(home_repo, octocat, respec, path));
}
exports.get_data = get_data;
//# sourceMappingURL=preview_links.js.map