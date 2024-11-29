/**
 * This function help me prevent the length of embed will over 1024
 * @param {string} input The input string
 * @param {number} limit The limit of the string
 * @returns {string}
 */
export function limitStrLength(input,limit) {
    const uh = "...";
    //return input.substring(0,limit-uh.length) + uh;
    return input.length > limit ? input.substring(0,limit-uh.length) + uh : input;
}