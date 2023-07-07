const fs = require('fs');
const path = require('path');

const getCurrentDirectoryBase = () => {
    return path.basename(process.cwd());
}

const getFileContent = (filePath) => {
    try {
        let fileContent = fs.readFileSync(filePath, 'utf8')
        return fileContent;
    } catch (err) {
        console.log("Make sure you have a config.json file in your current directory")
    }
}


module.exports = {
    getCurrentDirectoryBase,
    getFileContent
}