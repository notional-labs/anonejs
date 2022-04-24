import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { getWasmClient } from "../utils/getKeplr";

export const createSale = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = await getWasmClient();
  console.log(wasmClient);
  const gasPrice = GasPrice.fromString("0.002uan1");

  let jsonMsg = JSON.stringify(Config.msgListingPrice);

  let entrypoint = {
    send_nft: {
      contract: Config.nftMarketplaceContractAddr,
      token_id: Config.token_id,
      msg: Buffer.from(jsonMsg).toString("base64"),
    }
  };

  const txFee = calculateFee(3000000, gasPrice);

  const result = await wasmClient.execute(
    account,
    Config.cw721ContractAddr,
    entrypoint,
    txFee,
    "create sale"
  );

  console.log("Send nft from seller to nft marketplace Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  return wasmEvent;
};
