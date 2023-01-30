const fse = require("fs-extra")


const modelScript = () => {
    return `
import { Model, DataTypes } from "sequelize";
import db from "../core/database/database.js"


class ClassName extends Model {

}

ClassName.init({
// Model attributes are defined here
// name: {
//    type: DataTypes.STRING,
//    allowNull: false
// },


}, 
{
   sequelize: db, // We need to pass the connection instance
   modelName: 'ClassName', // We need to choose the model name
   timestamps: true
});

export default ClassName
    
    `
}

const makeModel = (name) => {

    console.log("name", name)
    if (!name) {
        console.log("name is undefined")
        return
    }
    const file = `models/${name}.js`;
    let slash = "/";
    let count = str.split("").filter(c => c === slash).length;



    if (!fse.existsSync(file)) {

        for (let i = 0; i < count; i++) {

        }

        const updatedContent = modelScript().replace(/ClassName/g, name);
        fse.writeFile(file, updatedContent, (errWrite) => {
            if (errWrite) {
                console.error(err);
                return;
            }
            console.log(`File created: ${file}`);
        });
    }
    else {
        console.log(`File already exists: ${file}`);
    }
}







module.exports = makeModel