#!/usr/bin/env node

const Runner = require("./runner.js");


const runner = new Runner();

const run = async () => {
    await runner.collectFiles(process.cwd());
    await runner.runTests();
};


run();
