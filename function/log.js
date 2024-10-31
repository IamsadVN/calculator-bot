import chalk from "chalk";
const warning = chalk.hex('#FFA500'); // Orange color

function getDateFull() {
    const date = new Date();
    return `[${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}] ~ [${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}]`;
}

export function errorLog(valueErr){
    console.log(`${chalk.blue(getDateFull())} ${chalk.whiteBright(`[ERROR]`)} ${chalk.redBright(`Đã phát hiện lỗi: \n${valueErr}`)}`);
}

export function infoLog(valueInfo) {
    console.log(`${chalk.blue(getDateFull())} ${chalk.whiteBright(`[INFO]`)} ${chalk.green(`${valueInfo}`)}`);
}

export function warnLog(valueWarn) {
    console.log(`${chalk.blue(getDateFull())} ${chalk.whiteBright(`[WARN]`)} ${warning(`${valueWarn}`)}`)
}

export function commandLog(userUseCommand,valueCommand,type) {
    console.log(`${chalk.blue(getDateFull())} ${chalk.whiteBright(`[CMD]`)} ${chalk.gray(`From: ${userUseCommand} | Command: ${valueCommand} | Type: ${type}`)}`);
}