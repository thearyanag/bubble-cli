const fs = require('fs');

const createCache = async (image,metadata,name,collection,no) => {


    let cache = {}

    for(let i = 0; i < no ; i++) {
        cache[i] = {
            image : image[i],
            metadata : metadata[i],
            name : name[i]
        }
    }

    cache['collection'] = collection

    fs.writeFileSync("./cache.json", JSON.stringify(cache));

}

module.exports = {
    createCache
}