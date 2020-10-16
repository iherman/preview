import * as preview_links from './lib/preview_links';
import * as spec          from './lib/epub_data';

const { program } = require('commander');

const markdown_start :string= `
See:

`;

const markdown :string = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;

async function main() {
    program
        .name('preview')
        .usage('[option] [pr_num')
        .description('Create a markdown snippet that can be inserted into as a PR comment for preview')
        .parse(process.argv);

    if (program.args.length === 0) {
        console.error('preview error: no PR number has been provided; exciting')
        process.exit(-1)
    } else {
        const url    = `https://github.com/w3c/${spec.repo_name}/pull/${program.args[0]}`;
        try {
            const URLs :preview_links.URLs[] = await preview_links.get_data(url, true, spec.parts.map((part) => part.path));

            const final = URLs.reduce((accumulator: string, currentValue: preview_links.URLs, currentIndex: number): string => {
                return accumulator + markdown.replace('{title}', spec.parts[currentIndex].title).replace('{preview}', currentValue.new).replace('{diff}', currentValue.diff);
            }, '');
            console.log(markdown_start + final);
        } catch(e) {
            console.log(`preview error: ${e}`);
            process.exit(-1);
        }
    }
}

main();
