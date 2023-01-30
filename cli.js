#!/usr/bin/env node

const program = require('commander') 
const fse = require("fs-extra")

program
    .command('makeme:model')
    .option('-n, <name>', 'Name of the model')
    .option('-n, <media>', 'Name of the model')
    .action((options) => {

	if(!options.name)
        {
           console.log("name is undefined")
	   return
        }

        const file = `models/${options.name}.js`;

        if (!fse.existsSync(file)) {
            fse.writeFile(file, '', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.log(`File created: ${file}`);
            });
        }
        else {
            console.log(`File already exists: ${file}`);
        }

    });

program.parse(process.argv);