import fs from 'fs';
import path from 'path';

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

const getAssetStats = () => {
    try {
        let fileIndex = 0;
        let stats = fs.readdirSync("./assets");
        while (true) {
            let isFileImageExist = stats.includes(`${fileIndex}.png`);
            let isFileMetadataExist = stats.includes(`${fileIndex}.json`);
            if (isFileImageExist && isFileMetadataExist) {
                fileIndex++;
            }
            else {
                break;
            }
        }
        console.log(`You have ${fileIndex} assets in your assets folder`);
    } catch (err) {
        console.log("Make sure you have an assets folder in your current directory")
    }
}

export { getCurrentDirectoryBase, getFileContent, getAssetStats };