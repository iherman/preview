import * as constants from  './constants';
import * as fetch      from './fetch';
import * as urlHandler from 'url';


interface Repo {
    owner :string;
    repo  :string;
}

interface Branch {
    branch :string;
}

export interface URLs {
    new       :string;
    diff      :string;
}

/**
 * Generate all the URLs based on the JSON data of the PR. That JSON data is the one
 * returned by the Github API
 */
function get_urls(home_repo :Repo, octocat :any, respec :boolean) :URLs {
    const encodeurl = (url :string) :string => {
        return url.replace(/\?/g,'%3F').replace(/\&/g,'%26')
    }
    // Get the data for the repository of the submission
    const head_repo = octocat.head.repo.full_name.split('/');
    const submission_repo :Repo = {
        owner : head_repo[0],
        repo  : head_repo[1]
    };

    // Get the data for the submission branch
    const submission_branch :Branch = {
        branch : octocat.head.ref
    }

    // Get the new versions' URL
    const new_version :string = constants.new_version
        .replace('{owner}',submission_repo.owner)
        .replace('{repo}', submission_repo.repo)
        .replace('{branch}', submission_branch.branch);

    // Get the original versions' URL, which is necessary for the diff
    const old_version :string = constants.old_version
        .replace('{owner}',home_repo.owner)
        .replace('{repo}',home_repo.repo);

    const new_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', new_version)) : new_version;
    const old_spec = respec ? encodeurl(constants.spec_gen.replace('{url}', old_version)) : old_version;

    return {
        new  : new_version,
        diff : constants.html_diff.replace('{old}',old_spec).replace('{new}', new_spec)
    }
}

export async function get_data(url :string, respec :boolean = false) :Promise<URLs> {
    // The URL is the url for the PR.
    const parsed_path = urlHandler.parse(url).path.split('/');
    const home_repo :Repo = {
        owner : parsed_path[1],
        repo  : parsed_path[2]
    };
    const pr_number :string = parsed_path[4];
    const gh_api_url = constants.gh_api
                        .replace('{owner}',home_repo.owner)
                        .replace('{repo}',home_repo.repo)
                        .replace('{number}',pr_number);
    const octocat :any = await fetch.fetch_json(gh_api_url);
    return get_urls(home_repo, octocat, respec);
}