import * as get_urls from './lib/get_urls';
import * as constants from './lib/constants'


async function main() {
    const URLs :get_urls.URLs = await get_urls.get_data(process.argv[2]);
    console.log(constants.markdown.replace('{preview}', URLs.new).replace('{diff}', URLs.diff));
}

main();
