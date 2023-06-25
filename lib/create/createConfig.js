import fs from 'fs';

const createConfig = (config, stats) => {

    if (config["stat-confirm"] === false) {
        console.log("Please confirm the stats of your collection");
        return false;
    }

    if (config["symbol"] === false) {
        console.log("Please confirm the symbol of your collection");
        return false;
    }

    if (!fs.existsSync("config.json")) {
        fs.writeFileSync("config.json", "{}");
    }



    let config_file = {
        "number": stats.no,
        "symbol": config.symbol,
        "sellerFeeBasisPoints": config.sellerfee,
        "isMutable": config.is_nft_mutable,
        "uploadMethod": "bundlr",
        "creators": config.creators,
    }

    fs.writeFileSync("config.json", JSON.stringify(config_file, null, 2));

    return true;
}

export { createConfig };