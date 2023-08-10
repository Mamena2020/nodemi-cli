import fse from "fs-extra"


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
   tableName: 'TableName', 
   modelName: 'ClassName', 
   timestamps: true,
   underscored: true
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
            let importDBLine = `core/database/Database.js"`
            const count = file.split("").filter(c => c === "/").length

            for (let i = 0; i < count; i++) {
                importDBLine = `../` + importDBLine
            }
            importDBLine = `import db from "` + importDBLine + `\n`

            // get class name from path
            const names = name.split("/") // Catalog/Product  
            const className = names[names.length - 1] // Product
            const tableName = makeSnakeCase(className)+"s"
            // change class name from default script
            const content = modelScript().replace(/ClassName/g, className).replace(/TableName/g,tableName)

            // adding import packages on top of line
            const lines = content.split("\n")
            lines[0] = importDBLine + lines[0]
            const updatedContent = lines.join("\n")

            fse.writeFile(file, updatedContent, (errWrite) => {
                if (errWrite) {
                    console.log("\x1b[31m", "errWrite", errWrite, "\x1b[0m")
                    return;
                }
                addToCoreModels(className, file)
                console.log("\x1b[32m", `File created: ${file}`, "\x1b[0m")
            });
        })

    }
    else {
        console.log("\x1b[31m", `File already exists: ${file}`, "\x1b[0m")
    }
}

const addToCoreModels = (className, pathModel) => {


    fse.readFile("models/Models.js", "utf-8", (err, data) => {
        if (err) {
            console.log("\x1b[31m", "err", err, "\x1b[0m")
            return;
        }

        const addModule = `import ` + className + ` from "../` + pathModel + `"\n`

        const addModel = `\n    await ` + className + `.sync()\n\n`

        const index = data.lastIndexOf(`}`);
        if (index !== -1) {

            data = data.substring(0, index) + addModel + data.substring(index);
            data = addModule + data.substring(0, data.length)
            fse.writeFile("models/Models.js", data, (err) => {
                if (err) throw err;

                console.log("\x1b[32m", `${className} model registered on models/Models.js`, "\x1b[0m")
            });
        }
    })
}


const makeSnakeCase = (str) => {
    let result = str.replace(/([A-Z])/g, (match) => `_${match.toLowerCase()}`);
    return result.charAt(0) === '_' ? result.substr(1) : result;
}



export default makeModel