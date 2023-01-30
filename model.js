const fse = require("fs-extra")


const modelScript = () => {
    return `import { Model, DataTypes } from "sequelize";


class ClassName extends Model {
}

ClassName.init({
// Model attributes are defined here
// name: {
//    type: DataTypes.STRING,
//    allowNull: false
// }
 }, 
 {
   sequelize: db, 
   modelName: 'ClassName', 
   timestamps: true
 }
);

export default ClassName
    
    `
}

const makeModel = (name) => {

    // console.log("Model name: ", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    const file = `models/${name}.js`;

    if (!fse.existsSync(file)) {

        fse.ensureFile(file, (errEnsure) => {
            if (errEnsure) {
                console.log("\x1b[31m", "errEnsure", errEnsure, "\x1b[0m")
                return;
            }
            // add path tree
            let importDBLine = `core/database/database.js"`
            let count = file.split("").filter(c => c === "/").length

            for (let i = 0; i < count; i++) {
                importDBLine = `../` + importDBLine
            }
            importDBLine = `import db from "` + importDBLine + `\n`
            
            // get model name from path
            let names = name.split("/") // Catalog/Product  
            let modelName = names[names.length - 1] // Product

            // change model name
            const content = modelScript().replace(/ClassName/g, modelName)
            
            // adding import packages on top of line
            let lines = content.split("\n")
            lines[0] = importDBLine + lines[0]
            updatedContent = lines.join("\n")

            fse.writeFile(file, updatedContent, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                console.log("\x1b[32m", `File created: ${file}`, "\x1b[0m")
            });
        })

    }
    else {
        console.log("\x1b[31m", `File already exists: ${file}`, "\x1b[0m")
    }
}







module.exports = makeModel