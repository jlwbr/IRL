
function filterEmotes(message: string, emotes: { [key: string]: string[] }) {
    const stringReplacements: { stringToReplace: string, replacement: string }[] = [];

    // iterate of emotes to access ids and positions
    Object.entries(emotes).forEach(([id, positions]) => {
        // use only the first position to find out the emote key word
        const position = positions[0];
        const [start, end] = position.split("-");
        const stringToReplace = message.substring(
            parseInt(start, 10),
            parseInt(end, 10) + 1
        );

        stringReplacements.push({
            stringToReplace: stringToReplace,
            replacement: "",
        });
    });

    return stringReplacements;
}

function filterURLS(message: string) {
    const stringReplacements: { stringToReplace: string, replacement: string }[] = [];

    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);

    if (urls) {
        urls.forEach((url) => {
            stringReplacements.push({
                stringToReplace: url,
                replacement: `[link naar ${new URL(url).hostname.replace("www.", "")}]`,
            });
        });
    }

    return stringReplacements;
}


export function filterMSG(message: string, emotes?: { [key: string]: string[] }) {
    const stringReplacements: { stringToReplace: string, replacement: string }[] = [];

    if (emotes) stringReplacements.push(...filterEmotes(message, emotes));
    stringReplacements.push(...filterURLS(message));

    // generate HTML and replace all emote keywords with image elements
    const messageHTML = stringReplacements.reduce(
        (acc, { stringToReplace, replacement }) => acc.replaceAll(stringToReplace, replacement),
        message
    );

    return messageHTML;
}