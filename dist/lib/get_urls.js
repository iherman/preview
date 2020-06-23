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
exports.get_data = void 0;
const constants = __importStar(require("./constants"));
const fetch = __importStar(require("./fetch"));
/**
 * Generate all the URLs based on the JSON data of the PR. That JSON data is the one
 * returned by the Github API
 */
function get_urls(home_repo, octocat, respec) {
    const encodeurl = (url) => {
        return url.replace(/\?/g, '%3F').replace(/\&/g, '%26');
    };
    // Get the data for the repository of the submission
    const head_repo = octocat.head.repo.full_name.split('/');
    const submission_repo = {
        owner: head_repo[0],
        repo: head_repo[1]
    };
    // Get the data for the submission branch
    const submission_branch = {
        branch: octocat.head.ref
    };
    // Get the new versions' URL
    const new_version = constants.new_version
        .replace('{owner}', submission_repo.owner)
        .replace('{repo}', submission_repo.repo)
        .replace('{branch}', submission_branch.branch);
    // Get the original versions' URL, which is necessary for the diff
    const old_version = constants.old_version
        .replace('{owner}', home_repo.owner)
        .replace('{repo}', home_repo.repo);
    const new_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', new_version)) : new_version;
    const old_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', old_version)) : old_version;
    return {
        new: new_version,
        diff: constants.html_diff.replace('{old}', old_spec).replace('{new}', new_spec)
    };
}
async function get_data(url, respec = false) {
    // The URL for the PR.
    const parsed_path = new URL(url).pathname.split('/');
    const home_repo = {
        owner: parsed_path[1],
        repo: parsed_path[2]
    };
    const pr_number = parsed_path[4];
    const gh_api_url = constants.gh_api
        .replace('{owner}', home_repo.owner)
        .replace('{repo}', home_repo.repo)
        .replace('{number}', pr_number);
    const octocat = await fetch.fetch_json(gh_api_url);
    return get_urls(home_repo, octocat, respec);
}
exports.get_data = get_data;
//# sourceMappingURL=get_urls.js.map