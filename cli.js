#!/usr/bin/env node

const program = require('commander')
const makeModel = require("./model.js")


program
    .command('make:model <name>')
    // .option('-n, --media <media>', 'pair with media')
    // // .option('-n, --media <media>', 'pair with media')
    .action((name) => {
        makeModel(name)
    });

program.parse(process.argv);