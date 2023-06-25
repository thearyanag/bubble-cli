import bundlrClient from "./bundlrClient.js";
import fs from "fs";
const tags = [{ name: "Content-Type", value: "image/png" }];
// the folder where the file is located
const uploadImageToBundlr = async (number,stats) => {

    if(!stats["price-confirm"]) process.exit(1);

    const folder = fs.readdirSync("./assets");

    for(let i = 0; i < number; i++) {
        const fileToUpload = `./assets/${i}.png`;
        try {
            const response = await bundlrClient.uploadFile(fileToUpload, tags);
            console.log(`File uploaded ==> https://arweave.net/${response.id}`);
        }
        catch (e) {
            console.log("Error uploading files , please make sure you have a PRIVATE_KEY.txt file with your private key in the root folder");
        }
        return
    }

    console.log(folder);

};



// try {
//   const response = await bundlr.uploadFile(fileToUpload, tags);
//   console.log(`File uploaded ==> https://arweave.net/${response.id}`);
// } catch (e) {
//   console.log("Error uploading file ", e);
// }

export { uploadImageToBundlr };