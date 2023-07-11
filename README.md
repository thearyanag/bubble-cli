# My First Compressed NFT collection


The goal of this tutorial is to take you from zero to one: you will learn to install Bubble and use its basic commands to configure and deploy a compressed NFT collection to Solana's devnet. It will provide you with a foothold on the basics and enough knowledge that you can then use the rest of the developer resources to learn the more advanced details for using Bubble.

## Prerequisite Knowledge

- You should have a basic understanding of how to find and use a terminal on your OS, including navigating directories, and running commands: an example of a terminal for macOS is [iTerm2](https://iterm2.com/).
- You should have basic familiarity with what Solana is but don't need advanced technical knowledge.
- You should have basic familiarity with the Solana NFT Standard but, again, do not need advanced technical knowledge.

## Setup

This tutorial targets macOS, Linux, and Windows Subsystem Linux (WSL), but all commands. It should work on any of those three systems.

## Install Bubble

<span style="color:red">Please note that the package is still being uploaded to npm/yarn therefore instead of directly running the commands, you have to first clone the repo and do node index.js as mentioned in the video's above.</span>.

To install Bubble, simply copy and paste and run this command in your terminal:

```bash
npm install -g bubble_cli
```

Follow any instructions from the install script regarding updating your PATH. This may require closing and reopening your terminal. Once complete you should be able to run the command `bubble` in your terminal and get a list of available commands:

```bash
bubble
```

<details>
<summary>Output</summary>
<p>

```
bubble-cli 0.6.0
Command line tool for creating and managing compressed NFT.

USAGE:
bubble [OPTIONS] <SUBCOMMAND>

OPTIONS:

-h, --help Print help information
-l, --log-level <LOG_LEVEL> Log level: trace, debug, info, warn, error, off
-V, --version Print version information

SUBCOMMANDS:
    create         Create a new config file
    upload         Upload a metadata from asset folder to Arweave
    deploy         Deploy a new collection on Solana
    batch-mint     Mint a batch of NFTs to the wallet addresses in wallets.txt
    set-cluster    Set the cluster to connect to mainnet-beta or devnet
    set-rpc        Set the RPC URL to connect to Solana [ we are based and recommend using Helius RPC ]
    info           Get the current cluster and RPC URL
```

</p>
</details>

## Set Up Your Project

Next we are going to set up a simple project directory with some example assets which you can download from [here](https://arweave.net/RhNCVZoqC6iO0xEL0DnsqZGPSG_CK_KeiU4vluOeIoI). Extract the zip file and rename the folder to 'assets'.

Create a folder for your project somewhere convenient on your OS. For this tutorial we are creating a folder called MyProject on the Desktop. Next, copy the "assets" folder you downloaded into this folder so your project directory looks like the following:

```
MyProject/
     assets/
         0.png
         0.json
         1.png
         1.json
         . . .
```

We will run all our Bubble commands from within the project directory and Bubble will create our config and cache files in that directory. If we do this, we can elide the cache and config files from our commands as Bubble will look in the current directory for `config.json` and `cache.json` files.

## Create a Config File

The config file tells Bubble how to configure your compressed collection with values such as number of assets, what creators to use, what settings to apply, etc. To create a config file we are going to use the Bubble `create-config` interactive command.

Run the following command in your terminal from within your project directory:

```bash
bubble create
```

We will now get a series of questions we need to answer to set up our config file.

Open up the generated file, config.json, in your favorite text or code editor (e.g. [VS Code](https://code.visualstudio.com/)). You should see a file similar to this:

```json
{
  "number": 10,
  "symbol": true,
  "sellerFeeBasisPoints": "500",
  "isMutable": true,
  "uploadMethod": "bundlr",
  "creators": "FheF4yQu97rmDRqTeN239CPQKJ2bPs5yb3W92QNUMywq:100"
}
```

Your values will be different depending on and what you input for various settings.

## Upload Images and Metadata to External Storage

In this step, we will upload all our assets file pairs to Arweave via Bundlr.

```
bubble upload
```
Output

```
? The price for this upload is 0.00029086 SOL. Do you want to continue? Yes
Uploading 222668 bytes to the Solana blockchain...
Funding account with:  233318

📤 Uploading image files
(Ctrl+C to abort)


📤 Uploading metadata files
(Ctrl+C to abort)


Cache file created !
```

#### Caution 
However, some upload methods such as Bundlr, do cost funds to upload and store the data. If you successfully upload your data and then run it again, it will charge you again. If you do this repeatedly with a large amount of data it can cost you a significant amount of SOL. Once you have successfully uploaded your data you should not have to do it again, as the cache file will store all the links to the data. Ask on the Metaplex Discord if you run into any unexpected issues.
:::

When uploading is finished, bubble will have created a `cache.json` file in our project directory. Open this file, and you will see something similar to:

Summary>Output

```json
{
    "0": {
        "image": "https://arweave.net/ciJTbYi0ALpesI-wWAq_DWsY5UoVm2j0tcbDCyY57rg",
        "metadata": "https://arweave.net/Na033ero103SSkCBmUAhjalNrL25eWHMWxvcoEwdIhA",
        "name": "Number #0001"
    },
    "1": {
        "image": "https://arweave.net/dU25MSK5twyetxWJUDn6NRhzMffq5_s_BhiCmUrx26g",
        "metadata": "https://arweave.net/aG_RE3No3haSMB_hRbHTy8xCGWn_0U-LKvAGtWMC6EY",
        "name": "Number #0002"
    },
    "2": {
        "image": "https://arweave.net/vU6a9CPmWg7IEJey5Ub5E3aU2U2mTvbuKEJLJ38a2yA",
        "metadata": "https://arweave.net/YJObVtkl2qly9BXaplyP3JZRGX5SA84_r1dnZZydG8U",
        "name": "Number #0003"
    },
    "3": {
        "image": "https://arweave.net/kbkbBuXI5vsdgoOZF7Hjv_V8YDK-Nq73gSWw3Qag7Qg",
        "metadata": "https://arweave.net/T1foAp4g2VvwqUuCur0vNJDDgWQq7NFU3dvvyhFQm8Q",
        "name": "Number #0004"
    },
    "4": {
        "image": "https://arweave.net/xiZxsix0iP-_QqMW0QpO9kla_DjEe9WDoNO8Zv2ry9w",
        "metadata": "https://arweave.net/4Zbdshdoe9PlzzZZz158lawJBaQx50yV73jxF98l43s",
        "name": "Number #0005"
    },
    "5": {
        "image": "https://arweave.net/xZda9R87JafAxf885WSgLdlrXIdGWB1PdD8DUR1D-vY",
        "metadata": "https://arweave.net/vnmV_YmzDMFyyN8t1Bm1lZd717lIzZfUjx3A5m9KXEo",
        "name": "Number #0006"
    },
    "6": {
        "image": "https://arweave.net/iJK1-iPpYFT1AP_nFyJ0mZFIwQsuX9QbqP6Wj4lXssU",
        "metadata": "https://arweave.net/2-80nB5Qt-mLbHHgT2RzZUnTLOojwPUOGBZfLrLFD58",
        "name": "Number #0007"
    },
    "7": {
        "image": "https://arweave.net/gU8fqikmh8X5UykVSYoDIJr1kfOs3z8z8yAk9em4k1A",
        "metadata": "https://arweave.net/ZC-ymeNF5QRTBhWsdxPDf1MmRBCafu0nIOkuavEZSyE",
        "name": "Number #0008"
    },
    "8": {
        "image": "https://arweave.net/DV7CsiQCfDxZpY8O_QVqEcAoV_zL-TwENoK2mkUKW8o",
        "metadata": "https://arweave.net/TOySn_tHdGj9qLMuiDSQyI-yzOQpOVJ_G8eSG_nK8SU",
        "name": "Number #0009"
    },
    "9": {
        "image": "https://arweave.net/X-v65CddUohvxxq9AXb7GyhX1c2SGblDAc6z5hFxHh8",
        "metadata": "https://arweave.net/Irk1QJb9QuO5XPttP7AGssQ8zY0yZT3r9MwyrxA0MT4",
        "name": "Number #0010"
    },
}
```

Each asset from our `assets` directory has been uploaded to Arweave and a link to it stored in the cache file. You can open one of these links in the browser to see what this looks like. Within the data in the metadata link, there is another link to the image. Both of these links are stored for each item in the cache file.

## Deploy the collection

To create and deploy the collection, run the `deploy` command:

```bash
bubble deploy
```
#### Output
Collection created at 61PxNqroV1jhMm1xv7PdHDPe7gj1xqVzJQTBLDDH13qB

Tree created with signature :  3msvYMrTdXQo3JTYzsy7xBzxHNNjdHDbG2qD8aGKvMEtEfosGyug1T9BMnRrjtsXwNkF1HTfURgQT3TMyPnZjviV

Deploying collection on Solana...

Deploying 1 of 10 NFTs

Deploying 2 of 10 NFTs

Deploying 3 of 10 NFTs

Deploying 4 of 10 NFTs

Deploying 5 of 10 NFTs

Deploying 6 of 10 NFTs

Deploying 7 of 10 NFTs

Deploying 8 of 10 NFTs

Deploying 9 of 10 NFTs

Deploying 10 of 10 NFTs

✅ Command successful.

Once this finishes, if you open up the cache.json file again you will see that the values have been filled in as we now have the collection created on-chain

## Batch Mint 

Before running this command make sure to have a wallets.txt file in root folder with the same number of wallet address as assets. 

To create and deploy the collection, run the `batch-mint` command:


```bash
bubble batch-mint
```
#### Output
Collection created at 61PxNqroV1jhMm1xv7PdHDPe7gj1xqVzJQTBLDDH13qB

Tree created with signature :  3msvYMrTdXQo3JTYzsy7xBzxHNNjdHDbG2qD8aGKvMEtEfosGyug1T9BMnRrjtsXwNkF1HTfURgQT3TMyPnZjviV

Deploying collection on Solana...

Minting 1 of 10 NFTs

Minting 2 of 10 NFTs

Minting 3 of 10 NFTs

Minting 4 of 10 NFTs

Minting 5 of 10 NFTs

Minting 6 of 10 NFTs

Minting 7 of 10 NFTs

Minting 8 of 10 NFTs

Minting 9 of 10 NFTs

Deploying 10 of 10 NFTs

✅ Minting successful.

Once this finishes, if you open up the cache.json file again you will see that the values have been filled in as we now have the collection created on-chain

## Mint a NFT

Finally, to round off this tutorial we will mint an NFT from our bubble to ensure it works as expected. Run:

```bash
bubble mint [address]
```

to mint one NFT to your wallet address.

#### Output

See the transaction here: https://solscan.io/tx/2Vm5bHBSGqCDyyLxxZff357Cm9CtzWz4BhUDvUgpcmKmZMLitpsUPduNtxXMkbaMjZVr3UAxc6kcJ52ayfKR7PSJ?cluster=devnet

✅ Command successful.


Congratulations! You have successfully configured, created, and deployed your compressed collection !
