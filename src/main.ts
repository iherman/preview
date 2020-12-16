import * as preview_links from './lib/preview_links';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { program } = require('commander');

async function main() {
    program
        .name('preview')
        .usage('[option] [pr_url')
        .description('Create a markdown snippet that can be inserted into as a PR comment for preview')
        .option('-t, --text', 'whether the source is a plain vanilla HTML (as opposed to respec')
        .option('-s, --service [service]', 'name of the service to use; value can be "githack" or "statically"')
        .parse(process.argv);

    if (program.args.length === 0) {
        console.error('preview error: no PR URL has been provided; exiting')
        process.exit(-1)
    } else {
        const url     = program.args[0];

        let service = program.service || 'statically';
        if (service !== preview_links.constants.GITHACK && service !== preview_links.constants.STATICALLY) {
            console.warn(`Unknown service ${service}; using statically`);
            service = preview_links.constants.STATICALLY;
        }

        const respec  = program.text === undefined;
        try {
            const URLs :preview_links.URLs[] = await preview_links.get_data(url, service, respec);
            console.log(preview_links.constants.markdown.replace('{preview}', URLs[0].new).replace('{diff}', URLs[0].diff));
        } catch (e) {
            console.log(`preview error: ${e}`);
            process.exit(-1);
        }
    }
}

main();
