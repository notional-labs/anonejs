import { calculateFee, GasPrice } from "@cosmjs/stargate";

export const createCollection = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = JSON.parse(localStorage.getItem("wasmClient"));
  const gasPrice = GasPrice.fromString('0.002uan1');
  const royaltyInfo = {
    payment_address: Config.royaltyPaymentAddress,
    share: Config.royaltyShare
  };

  const instantiateMsg = {
    base_token_uri: Config.baseTokenUri,
    num_tokens: Config.numTokens,
    an721_code_id: Config.an721CodeId,
    an721_instantiate_msg: {
      name: Config.name,
      symbol: Config.symbol,
      minter: account,
      collection_info: {
        creator: account,
        description: Config.description,
        image: Config.image,
        external_link: Config.external_link,
        royalty_info: royaltyInfo,
      },
    },
    per_address_limit: Config.perAddressLimit,
  };

  const txFee = calculateFee(300000, gasPrice);

  const result = await wasmClient.instantiate(
    account,
    50, // minter_code_id (stored)
    instantiateMsg,
    Config.name,
    txFee
  );

  console.log("Create Collection Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  const minter_info = {
      minter_contract_address: wasmEvent.attributes[0]['value'],
      an721_contract_address: wasmEvent.attributes[5]['value']
  }
  return minter_info;
}
