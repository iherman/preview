import * as get_urls from './lib/get_urls';
import * as constants from './lib/constants'

/** @hidden */
const { program } = require('commander');


async function main() {
    program
        .name('preview')
        .usage('[option] [pr_url')
        .description('Create a markdown snippet that can be inserted into as a PR comment for preview')
        .option('-t, --text', 'whether the source is a plain vanilla HTML (as opposed to respec')
        .parse(process.argv);

    if (program.args.length === 0) {
        console.error('preview error: no PR URL has been provided; exciting')
        process.exit(-1)
    } else {
        const url    = program.args[0];
        const respec = program.text === undefined;
        try {
            const URLs :get_urls.URLs = await get_urls.get_data(url, respec);
            console.log(constants.markdown.replace('{preview}', URLs.new).replace('{diff}', URLs.diff));
        } catch(e) {
            console.log(`preview error: ${e}`);
            process.exit(-1);
        }
    }
}

main();
