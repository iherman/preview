const statically :string = 'https://cdn.statically.io/gh/{owner}/{repo}/{branch}/index.html';
const githack :string    = 'https://raw.githack.com/{owner}/{repo}/{branch}/index.html';

export const new_version = statically;
export const old_version = 'https://{owner}.github.io/{repo}/';
export const gh_api      = 'https://api.github.com/repos/{owner}/{repo}/pulls/57';

/**
 * Flag to decide whether the code runs in a browser or in node.js
 */

export const is_browser :boolean = (process === undefined || process.title === 'browser');
