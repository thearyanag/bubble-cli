const fs= require("fs");

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

    let constants = {
        "rpc": "https://api.devnet.solana.com",
        "cluster": "devnet"
    }

    fs.writeFileSync("constants.json", JSON.stringify(constants, null, 2));

    fs.writeFileSync("config.json", JSON.stringify(config_file, null, 2));

    return true;
}

module.exports = { 
    createConfig
}