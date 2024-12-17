import * as preview_links from './lib/preview_links.ts'
import * as specs         from './lib/epub_data.ts';
import { Command }        from 'npm:commander';
const markdown_start = `
See:

`;

const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;

async function main(): Promise<void> {
    const program = new Command();
    program
    .name('preview')
    .usage('[option] [pr_num]')
    .description('Create a markdown snippet that can be inserted into as a PR comment for preview')
    .option('-s, --service [service]', 'name of the service to use; value can be "githack" or "statically"')
    .parse(['', '', ...Deno.args]);

    const options = program.opts();

    if(program.args.length === 0) {
        console.error('preview error: no PR number has been provided; exciting')
        Deno.exit(-1)
    } else {
        const url = `https://github.com/${specs.repo_owner}/${specs.repo_name}/pull/${program.args[0]}`;
        try {
            let service = options.service || 'statically';
            if (service !== preview_links.constants.GITHACK && service !== preview_links.constants.STATICALLY) {
                console.warn(`Unknown service ${service}; using statically`);
                service = preview_links.constants.STATICALLY;
            }

            const URLs: preview_links.URLs[] = await preview_links.get_data(url, service, true, specs.parts.map((part) => part.path));

            const final = URLs.reduce((accumulator: string, currentValue: preview_links.URLs, currentIndex: number): string => {
                return accumulator + markdown.replace('{title}', specs.parts[currentIndex].title).replace('{preview}', currentValue.new).replace('{diff}', currentValue.diff);
            }, '');
            console.log(markdown_start + final);
        } catch (e) {
            console.log(`preview error: ${e}`);
            Deno.exit(-1);
        }
    }
}

main();
