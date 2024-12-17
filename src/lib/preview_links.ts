// deno-lint-ignore-file no-namespace
export namespace constants {
    export const statically: string = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/{file}';
    export const githack: string = 'https://raw.githack.com/{owner}/{repo}/{branch}/{file}';

    export const GITHACK: string = "githack";
    export const STATICALLY: string = "statically";

    export const old_version: string = 'https://{owner}.github.io/{repo}/{file}';
    export const gh_api: string = 'https://api.github.com/repos/{owner}/{repo}/pulls/{number}';
    export const html_diff: string = 'https://services.w3.org/htmldiff?doc1={old}&doc2={new}';
    export const spec_gen: string = 'https://labs.w3.org/spec-generator/?type=respec&url={url}'

    export const markdown: string = `
See:

* [Preview]({preview})
* [Diff]({diff})
`
}

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

// to make typescript happy
interface Octo {
    head : {
        repo: {
            full_name : string
        },
        ref : string,
    }
}

/**
 * Generate all the URLs based on the JSON data of the PR. That JSON data is the one
 * returned by the GitHub API
 *
 * @param main_repo - identification of the main repo, ie, the target of the PR
 * @param octocat - the data returned by the GitHub API for the PR
 * @param service - name of the caching service
 * @param respec - whether the sources are to be encapsulated into a spec generator call for respec in the html diff
 * @param path - the path of the file to be converted
 */
function get_urls(main_repo: Repo, octocat: Octo, service: string, respec: boolean, path: string = 'index.html') :URLs {
    /**
    * The URL used in the spec generator must be percent encoded
    */
    const encodeurl = (url :string) :string => {
        return url.replace(/\?/g,'%3F').replace(/&/g,'%26')
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
 * @param respec - Flag whether the documents are in ReSpec, i.e., should be converted before establish the diffs
 * @param paths - Path to the file to be converted
 */
export async function get_data(url :string, service: string, respec = true, paths :string[] = ['index.html']) :Promise<URLs[]> {
    /**
     *
     * The standard idiom to get JSON data via fetch
     * @async
     */
    const fetch_json = async (resource_url :string) :Promise<Octo> => {
        const response = await fetch(resource_url);
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
    const octocat: Octo = await fetch_json(gh_api_url);

    return paths.map((path) => get_urls(home_repo, octocat, service, respec, path));
}