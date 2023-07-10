const axios = require("axios");
const constants = require("../../constants");

// const RPC = constants.getRpc();
const RPC = "https://rpc-devnet.helius.xyz/?api-key=7af4bda5-23e2-4d78-a78f-49e79cf354ed";

async function getAsset(assetId, rpcUrl = RPC) {
  try {
    const axiosInstance = axios.create({
      baseURL: rpcUrl,
    });
    const response = await axiosInstance.post(rpcUrl, {
      jsonrpc: "2.0",
      method: "getAsset",
      id: "rpd-op-123",
      params: {
        id: assetId,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
}

async function getAssetProof(assetId, rpcUrl = RPC) {
  try {
    const axiosInstance = axios.create({
      baseURL: rpcUrl,
    });
    const response = await axiosInstance.post(rpcUrl, {
      jsonrpc: "2.0",
      method: "getAssetProof",
      id: "rpd-op-123",
      params: {
        id: assetId,
      },
    });
    return response.data.result;
  } catch (error) {
    console.error(error);
  }
}

async function getAssetsByOwner(ownerAddress, rpcUrl = RPC) {
  try {
    const axiosInstance = axios.create({
      baseURL: rpcUrl,
    });

    const response = await axiosInstance.post(rpcUrl, {
      jsonrpc: "2.0",
      method: "getAssetsByOwner",
      id: "rpd-op-123",
      params: {
        ownerAddress: ownerAddress,
        page: 1, // Starts at 1
        limit: 100,
      },
    });
    return response.data.result.items;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  getAsset,
  getAssetProof,
  getAssetsByOwner,
};
