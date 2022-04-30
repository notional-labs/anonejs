import { getWasmClient } from "../utils/getKeplr";

// 1. Functions for query information about account
export const queryAccountInfo = async (Config) => {
  const wasmClient = await getWasmClient();
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const balance = await wasmClient.getBalance(account, "uan1");
  return balance; // return account's AN1 balance
};

// 2. Functions for query information about Nft and Collection
export const queryNftInfoById = async (Config) => {
  const wasmClient = await getWasmClient();
  const nftInfo = await wasmClient.queryContractSmart(
    Config.cw721ContractAddr,
    {
      all_nft_info: {
        token_id: Config.tokenId,
      },
    }
  );

  const result = {
    token_id: Config.tokenId,
    owner: nftInfo.access.owner,
    approvals: nftInfo.access.approvals,
    model_id: nftInfo.info.model_id,
    token_uri: nftInfo.info.token_uri,
    size: nftInfo.info.size,
    extension: nftInfo.info.extension,
    contract_addr: Config.cw721ContractAddr,
  };
  return result; // return all info about nft with this token_id
};

export const queryAllDataOfAllNfts = async (cw721ContractAddr) => {
  const wasmClient = await getWasmClient();
  const nftInfo = await wasmClient.queryContractSmart(cw721ContractAddr, {
    all_tokens_info: {},
  });
  return nftInfo; // return all data of all nfts
};

export const queryModelInfoById = async (Config) => {
  const wasmClient = await getWasmClient();
  const modelInfo = await wasmClient.queryContractSmart(
    Config.cw721ContractAddr,
    {
      model_info: {
        model_id: Config.modelId,
      },
    }
  );

  const result = {
    model_id: Config.modelId,
    owner: modelInfo.owner,
    model_uri: modelInfo.model_uri,
    extension: modelInfo.extension,
    contract_addr: Config.cw721ContractAddr,
  };

  return result; // return all info about shoe model with this model_id
};

export const queryNumberOfNfts = async (cw721ContractAddr) => {
  const wasmClient = await getWasmClient();
  const numTokens = await wasmClient.queryContractSmart(cw721ContractAddr, {
    num_tokens: {},
  });

  return numTokens.count; // return the number of nfts on this collection
};

export const queryNumberOfModels = async (cw721ContractAddr) => {
  const wasmClient = await getWasmClient();
  const numModels = await wasmClient.queryContractSmart(cw721ContractAddr, {
    num_models: {},
  });

  return numModels.count; // return the number of models on this collection
};

export const queryCollectionInfo = async (cw721ContractAddr) => {
  const wasmClient = await getWasmClient();

  const contractInfo = await wasmClient.queryContractSmart(cw721ContractAddr, {
    contract_info: {},
  });

  const collectionInfo = await wasmClient.queryContractSmart(
    cw721ContractAddr,
    {
      collection_info: {},
    }
  );

  const result = {
    name: contractInfo.name,
    symbol: contractInfo.symbol,
    creator: collectionInfo.creator,
    image: collectionInfo.image,
    description: collectionInfo.description,
    externalLink: collectionInfo.external_link,
    royaltyInfo: collectionInfo.royalty_info,
  };
  return result; // return all infomation about this collection
};

// 3. Functions for query information on Marketplace
export const queryOfferingList = async (Config) => {
  const wasmClient = await getWasmClient();
  const offeringList = await wasmClient.queryContractSmart(
    Config.nftMarketplaceContractAddr,
    {
      get_offerings: {
        sort_listing: Config.sortListing,
      },
    }
  );

  return offeringList.offerings; // return an array contains all of offerings on markerplace
};
