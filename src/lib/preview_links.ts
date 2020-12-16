/* eslint-disable @typescript-eslint/no-namespace */
export namespace constants {
    export const statically = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/{file}';
    export const githack    = 'https://raw.githack.com/{owner}/{repo}/{branch}/{file}';

    export const GITHACK    = "githack";
    export const STATICALLY = "statically";

    export const old_version = 'https://{owner}.github.io/{repo}/{file}';
    export const gh_api      = 'https://api.github.com/repos/{owner}/{repo}/pulls/{number}';
    export const html_diff   = 'https://services.w3.org/htmldiff?doc1={old}&doc2={new}';
    export const spec_gen    = 'https://labs.w3.org/spec-generator/?type=respec&url={url}'

    export const markdown = `
See:

* [Preview]({preview})
* [Diff]({diff})
`

    /**
     * Flag to decide whether the code runs in a browser or in node.js
     */
    export const is_browser :boolean = (process === undefined || process.title === 'browser');
}

/* ======================================= Interface to Fetch ========================= */
import * as node_fetch from 'node-fetch';
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
const my_fetch: ((arg :string) => Promise<any>) = constants.is_browser ? fetch : node_fetch.default;

/* ======================================= Core operations ========================= */

interface Repo {
    owner :string;
    repo :string;
}

interface Branch {
    branch :string;
}

export interface URLs {
    new :string;
    diff :string;
}

/**
 * Generate all the URLs based on the JSON data of the PR. That JSON data is the one
 * returned by the Github API
 *
 * @param main_repo - identification of the main repo, ie, the target of the PR
 * @param octocat - the data returned by the Github API for the PR
 * @param service - name of the caching service
 * @param respec - whether the sources are to be encapsulated into a spec generator call for respec in the html diff
 * @param path - the path of the file to be converted
 */
function get_urls(main_repo :Repo, octocat :any, service: string, respec :boolean, path = 'index.html') :URLs {
    /**
    * The URL used in the spec generator must be percent encoded
    */
    const encodeurl = (url :string) :string => {
        return url.replace(/\?/g,'%3F').replace(/\&/g,'%26')
    }

    // Get the data for the repository of the submission
    const head_repo = octocat.head.repo.full_name.split('/');
    const submission_repo :Repo = {
        owner : head_repo[0],
        repo  : head_repo[1],
    };

    // Get the data for the submission branch
    const submission_branch :Branch = {
        branch : octocat.head.ref,
    }

    // Get the new version's URL
    const service_url = (service === constants.GITHACK ? constants.githack : constants.statically);
    const new_version :string = service_url
        .replace('{owner}', submission_repo.owner)
        .replace('{repo}', submission_repo.repo)
        .replace('{branch}', submission_branch.branch)
        .replace('{file}', path);

    // Get the original versions' URL (used for the diff)
    const old_version :string = constants.old_version
        .replace('{owner}', main_repo.owner)
        .replace('{repo}', main_repo.repo)
        .replace('{file}', path);

    // If we the sources are in ReSpec, the URLs used in the HTML diff must be a call out to the spec generator
    // to generate the final HTML on the fly. Note that the URLs must be percent encoded.
    const new_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', new_version)) : new_version;
    const old_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', old_version)) : old_version;

    return {
        new  : new_version,
        diff : constants.html_diff.replace('{old}',old_spec).replace('{new}', new_spec)
    }
}

/**
 * Get the preview and html diff URLs for a PR.
 *
 * @async
 * @param url - URL of the PR
 * @param service - name of the caching service
 * @param respec - Flag whether the documents are in ReSpec, ie, should be converted before establish the diffs
 */
export async function get_data(url :string, service: string, respec = true, paths :string[] = ['index.html']) :Promise<URLs[]> {
    /**
     *
     * The standard idiom to get JSON data via fetch
     * @async
     */
    const fetch_json = async (resource_url :string) :Promise<any> => {
        const response = await my_fetch(resource_url);
        return await response.json();
    }

    // The URL for the PR.
    const parsed_path = new URL(url).pathname.split('/');
    const home_repo :Repo = {
        owner : parsed_path[1],
        repo  : parsed_path[2],
    };
    const pr_number :string = parsed_path[4];

    const gh_api_url = constants.gh_api
        .replace('{owner}', home_repo.owner)
        .replace('{repo}', home_repo.repo)
        .replace('{number}', pr_number);
    const octocat :any = await fetch_json(gh_api_url);

    return paths.map((path) => get_urls(home_repo, octocat, service, respec, path));
}
