const statically :string = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/index.html';
const githack :string    = 'https://raw.githack.com/{owner}/{repo}/{branch}/index.html';

export const new_version = statically;
export const old_version = 'https://{owner}.github.io/{repo}/';
export const gh_api      = 'https://api.github.com/repos/{owner}/{repo}/pulls/{number}';
export const html_diff   = 'https://services.w3.org/htmldiff?doc1={old}&doc2={new}';
export const spec_gen    = 'https://labs.w3.org/spec-generator/?type=respec&url={url}'

export const markdown :string = `
See:

* [Preview]({preview})
* [Diff]({diff})
`


/**
 * Flag to decide whether the code runs in a browser or in node.js
 */

export const is_browser :boolean = (process === undefined || process.title === 'browser');
