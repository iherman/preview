// src/lib/preview_links.ts
var constants;
((constants2) => {
  constants2.statically = "https://cdn.statically.io/gh/{owner}/{repo}/{branch}/{file}";
  constants2.githack = "https://raw.githack.com/{owner}/{repo}/{branch}/{file}";
  constants2.GITHACK = "githack";
  constants2.STATICALLY = "statically";
  constants2.old_version = "https://{owner}.github.io/{repo}/{file}";
  constants2.gh_api = "https://api.github.com/repos/{owner}/{repo}/pulls/{number}";
  constants2.html_diff = "https://services.w3.org/htmldiff?doc1={old}&doc2={new}";
  constants2.spec_gen = "https://labs.w3.org/spec-generator/?type=respec&url={url}";
  constants2.markdown = `
See:

* [Preview]({preview})
* [Diff]({diff})
`;
})(constants || (constants = {}));
function get_urls(main_repo, octocat, service, respec, path = "index.html") {
  const encodeurl = (url) => {
    return url.replace(/\?/g, "%3F").replace(/&/g, "%26");
  };
  const head_repo = octocat.head.repo.full_name.split("/");
  const submission_repo = {
    owner: head_repo[0],
    repo: head_repo[1]
  };
  const submission_branch = {
    branch: octocat.head.ref
  };
  const service_url = service === constants.GITHACK ? constants.githack : constants.statically;
  const new_version = service_url.replace("{owner}", submission_repo.owner).replace("{repo}", submission_repo.repo).replace("{branch}", submission_branch.branch).replace("{file}", path);
  const old_version = constants.old_version.replace("{owner}", main_repo.owner).replace("{repo}", main_repo.repo).replace("{file}", path);
  const new_spec = respec ? encodeurl(constants.spec_gen.replace("{url}", new_version)) : new_version;
  const old_spec = respec ? encodeurl(constants.spec_gen.replace("{url}", old_version)) : old_version;
  return {
    new: new_version,
    diff: constants.html_diff.replace("{old}", old_spec).replace("{new}", new_spec)
  };
}
async function get_data(url, service, respec = true, paths = ["index.html"]) {
  const fetch_json = async (resource_url) => {
    const response = await fetch(resource_url);
    return await response.json();
  };
  const parsed_path = new URL(url).pathname.split("/");
  const home_repo = {
    owner: parsed_path[1],
    repo: parsed_path[2]
  };
  const pr_number = parsed_path[4];
  const gh_api_url = constants.gh_api.replace("{owner}", home_repo.owner).replace("{repo}", home_repo.repo).replace("{number}", pr_number);
  const octocat = await fetch_json(gh_api_url);
  return paths.map((path) => get_urls(home_repo, octocat, service, respec, path));
}

// src/lib/epub_data.ts
var family = "EPUB 3";
var repo_name = "epub-specs";
var repo_owner = "w3c";
var parts = [
  {
    path: "epub34/overview/index.html",
    title: "EPUB 3 Overview",
    short_name: "overview"
  },
  {
    path: "epub34/authoring/index.html",
    title: "EPUB 3.4",
    short_name: "core"
  },
  {
    path: "epub34/rs/index.html",
    title: "EPUB 3.4 Reading Systems",
    short_name: "rs"
  },
  {
    path: "wg-notes/multi-rend/index.html",
    title: "EPUB Multiple-Rendition Publications",
    short_name: "multi-rend"
  },
  {
    path: "wg-notes/tts/index.html",
    title: "EPUB 3 Text-to-Speech Enhancements",
    short_name: "tts"
  },
  {
    path: "epub34/a11y/index.html",
    title: "EPUB Accessibility 1.1.1",
    short_name: "a11y"
  },
  {
    path: "epub34/a11y-tech/index.html",
    title: "EPUB Accessibility Techniques",
    short_name: "a11y-tech"
  },
  {
    path: "wg-notes/epub-a11y-eaa-mapping/index.html",
    title: "EPUB Accessibility - EU Accessibility Act Mapping",
    short_name: "epub-a11y-eaa-mapping"
  },
  {
    path: "wg-notes/a11y-exemption/index.html",
    title: "The EPUB Accessibility exemption property",
    short_name: "a11y-exemption"
  },
  {
    path: "wg-notes/fxl-a11y/index.html",
    title: "EPUB Fixed Layout Accessibility",
    short_name: "fxl-a11y"
  },
  {
    path: "wg-notes/fxl-a11y-tech/index.html",
    title: "EPUB Fixed Layout Accessibility Techniques",
    short_name: "fxl-a11y-tech"
  },
  {
    path: "wg-notes/ssv/index.html",
    title: "EPUB 3 Structural Semantics Vocabulary",
    short_name: "fxl-a11y-tech"
  }
];

// src/browser_family.ts
var markdown_start = `
See:

`;
var markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;
function finalizePage() {
  const createChoice = (part) => {
    const pattern = '<input type="checkbox" name="{short_name}" id="{short_name}"><label for="{short_name}">{title}</label><br>\xA0\xA0';
    return pattern.replaceAll("{short_name}", part.short_name).replaceAll("{title}", part.title);
  };
  const headTitle = document.getElementsByTagName("title").item(0);
  if (headTitle && headTitle.textContent) {
    headTitle.textContent = headTitle.textContent.replace("{title}", family);
  }
  const mainTitle = document.querySelector("header h1");
  if (mainTitle && mainTitle.textContent) {
    mainTitle.textContent = mainTitle.textContent.replaceAll("{title}", family);
  }
  const choices = ["Specifications:<br/>\xA0\xA0", ...parts.map(createChoice)].join("\n").slice(0, -6);
  const spec_choices = document.getElementById("spec_choices");
  if (spec_choices) {
    spec_choices.innerHTML = choices;
  }
}
async function go(_e) {
  try {
    const number = document.getElementById("number");
    const url = ((value) => {
      if (value) {
        return `https://github.com/${repo_owner}/${repo_name}/pull/${value}`;
      } else {
        throw "No PR number has been provided.";
      }
    })(number.value);
    const service = document.getElementById("service");
    const parts2 = parts.filter((part) => {
      const choice = document.getElementById(part.short_name);
      return !(choice === null || choice.checked === false);
    });
    const URLs = await get_data(url, service.value, true, parts2.map((part) => part.path));
    const final = URLs.reduce((accumulator, currentValue, currentIndex) => {
      return accumulator + markdown.replace("{title}", parts2[currentIndex].title).replace("{preview}", currentValue.new).replace("{diff}", currentValue.diff);
    }, "");
    const markdown_box = document.getElementById("markdown");
    markdown_box.value = markdown_start + final;
  } catch (err) {
    alert(`preview error: ${err}`);
  }
}
globalThis.addEventListener("load", () => {
  finalizePage();
  const go_button = document.getElementById("go");
  if (go_button) {
    go_button.addEventListener("click", go);
  }
});
