import * as preview_links from './lib/preview_links.ts';
import { Command }        from 'npm:commander';


async function main(): Promise<void> {
    const program = new Command();
    program
        .name('preview')
        .usage('[option] [pr_url]')
        .description('Create a markdown snippet that can be inserted into as a PR comment for preview')
        .option('-t, --text', 'whether the source is a plain vanilla HTML (as opposed to respec')
        .option('-s, --service [service]', 'name of the service to use; value can be "githack" or "statically"')
        .parse(['', '', ...Deno.args]);

    const options = program.opts();

    if (program.args.length === 0) {
        console.error('preview error: no PR URL has been provided; exiting')
        Deno.exit(-1)
    } else {
        const url = program.args[0];
        let service = options.service || 'statically';

        if (service !== preview_links.constants.GITHACK && service !== preview_links.constants.STATICALLY) {
            console.warn(`Unknown service ${service}; using statically`);
            service = preview_links.constants.STATICALLY;
        }

        const respec = options.text === undefined;
        try {
            const URLs: preview_links.URLs[] = await preview_links.get_data(url, service, respec);
            console.log(preview_links.constants.markdown.replace('{preview}', URLs[0].new).replace('{diff}', URLs[0].diff));
        } catch (e) {
            console.log(`preview error: ${e}`);
            Deno.exit(-1);
        }
    }
}

main();
