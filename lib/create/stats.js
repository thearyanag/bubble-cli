import fs from "fs";

const getAssetStats = () => {
    try {
        let fileIndex = 0;
        let stats = fs.readdirSync("./assets");
        let collectionStats = fs.readFileSync("./assets/collection.json").toString();
        collectionStats = JSON.parse(collectionStats);
        let symbol = collectionStats.symbol;
        let totalSize = 0;
        while (true) {
            let isFileImageExist = stats.includes(`${fileIndex}.png`);
            let isFileMetadataExist = stats.includes(`${fileIndex}.json`);
            if (isFileImageExist && isFileMetadataExist) {
                let filestat = fs.statSync(`./assets/${fileIndex}.png`);
                totalSize += filestat.size;
                fileIndex++;
            }
            else {
                break;
            }
        }
        stats = {
            no : fileIndex,
            size : totalSize,
            symbol : symbol
        }
        return stats;
    } catch (err) {
        console.log("Make sure you have an assets folder in your current directory")
    }
}

export { getAssetStats };