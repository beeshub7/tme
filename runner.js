const fs = require("fs");
const path = require("path");
const chalk = require("chalk");


class Runner {
    constructor() {
        this.testFiles = [];
    }

    async runTests() {
        for (const file of this.testFiles) {
            console.log(chalk.grey(`---- ${file.shortName}`));
            const beforeEaches = [];

            global.beforeEach = fn => {
                beforeEaches.push(fn);
            };

            global.it = (desc, fn) => {
                beforeEaches.forEach(func => func());
                try {
                    fn();
                    console.log(chalk.green(`\tOK - ${desc}`));
                } catch (e) {
                    const message = e.message.replace(/\n/g, '\n\t\t');
                    console.log(chalk.red(`\tX - ${desc}`));
                    console.log(chalk.red('\t', message));
                }
            };

            try {
                require(file.name);
            } catch (e) {
                console.log(chalk.red(e));
            }
        }
    }

    async collectFiles(targetPath) {
        const files = await fs.promises.readdir(targetPath);

        for (const file of files) {
            const filePath = path.join(targetPath, file);
            const stats = await fs.promises.lstat(filePath);

            if (stats.isFile() && file.includes('.test.js')) {
                this.testFiles.push({name: filePath, shortName: file});
            } else if (stats.isDirectory()) {
                const childFiles = await fs.promises.readdir(filePath);

                files.push(...childFiles.map(f => path.join(file, f)));
            }
        }
    }
}


module.exports = Runner;
