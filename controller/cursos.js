import fs from "fs";

const readDataCursos = () => {
    try{
        const data = fs.readFileSync("./model/db.json");
        //console.log(JSON.parse(data));
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};


const writeDataCursos = () => {
    try{
        const data = fs.writeFileSync("./model/db.json");
        //console.log(JSON.parse(data));
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
    }
};