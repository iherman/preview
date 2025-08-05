import * as preview_links from './lib/preview_links.ts'
import { findFamily, type Family }     from './lib/multiple_data.ts';
import { Command }        from 'npm:commander@12.1.0';
const markdown_start = `
See:

`;

const markdown = `* For {title}:
    * [Preview]({preview})
    * [Diff]({diff})
`;

/**
 * Entry point to the family CLI case. The command line arguments are used
 * to generate a set of markdown snippets for preview; one snippet for each
 * specification as listed in the family.
 *
 * The main command line argument is the number of the PR. The repository data
 * is (indirectly) imported from the corresponding module in `./lib`.
 */
async function main(): Promise<void> {
    const program = new Command();
    program
        .name('preview')
        .usage('[option] [id] [pr_num]')
        .description('Create a markdown snippet that can be inserted into as a PR comment for preview.  When using deno, run it with the -A option.')
        .option('-f, --family [family]', 'name of the family of specifications to use. Defaults to "epub"')
        .option('-s, --service [service]', 'name of the service to use; value can be "githack" or "statically"')
        .parse(['', '', ...Deno.args]);

    const options = program.opts();

    if(program.args.length === 0) {
        console.error('preview error: no PR number has been provided; exciting')
        Deno.exit(-1)
    } else {
        const id = options.family || 'epub';
        const pr_num = program.args[0]

        try {
            // We know that the return is valid, because otherwise an exception is raised
            const specs: Family = findFamily(id);

            const url = `https://github.com/${specs.repo_owner}/${specs.repo_name}/pull/${pr_num}`;

            let service = options.service || 'statically';
            if (service !== preview_links.constants.GITHACK && service !== preview_links.constants.STATICALLY) {
                console.warn(`Unknown service ${service}; using statically`);
                service = preview_links.constants.STATICALLY;
            }

            const URLs: preview_links.URLs[] = await preview_links.get_data(url, service, true, specs.parts.map((part) => part.path));

            const final = URLs.reduce((accumulator: string, currentValue: preview_links.URLs, currentIndex: number): string => {
                return accumulator + markdown
                                        .replace('{title}', specs.parts[currentIndex].title)
                                        .replace('{preview}', currentValue.new)
                                        .replace('{diff}', currentValue.diff);
            }, '');
            console.log(markdown_start + final);
        } catch (e) {
            console.log(`preview error: ${e}`);
            Deno.exit(-1);
        }
    }
}

// noinspection JSIgnoredPromiseFromCall
main();
