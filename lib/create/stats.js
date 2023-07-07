const fs = require("fs");
const path = require("path");

const getAssetStats = () => {
    try {
        let fileIndex = 0;
        let directoryPath = path.join(__dirname, "../../assets");
        let stats = fs.readdirSync(directoryPath);
        directoryPath = path.join(__dirname, "../../assets/collection.json");
        let collectionStats = fs.readFileSync(directoryPath).toString();
        collectionStats = JSON.parse(collectionStats);
        let symbol = collectionStats.symbol;
        let imagesize = 0;
        let filesize = 0;
        while (true) {
            let isFileImageExist = stats.includes(`${fileIndex}.png`);
            let isFileMetadataExist = stats.includes(`${fileIndex}.json`);
            if (isFileImageExist && isFileMetadataExist) {
                let imagestat = fs.statSync(`./assets/${fileIndex}.png`);
                let filestat = fs.statSync(`./assets/${fileIndex}.json`);
                imagesize += imagestat.size;
                filesize += filestat.size;
                fileIndex++;
            }
            else {
                break;
            }
        }
        stats = {
            no : fileIndex,
            imagesize : imagesize,
            filesize : filesize,
            symbol : symbol
        }
        return stats;
    } catch (err) {
        console.log("Make sure you have an assets folder in your current directory")
    }
}

module.exports = {
    getAssetStats
}