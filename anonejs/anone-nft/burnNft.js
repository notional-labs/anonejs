import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { getWasmClient } from "../utils/getKeplr";

export const burnNft = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = await getWasmClient();
  const gasPrice = GasPrice.fromString("0.002uan1");

  let entrypoint = {
    burn: {
      token_id: Config.tokenId
    }
  };

  const txFee = calculateFee(3000000, gasPrice);

  const result = await wasmClient.execute(
    account,
    Config.cw721ContractAddr,
    entrypoint,
    txFee,
    "burn Nft"
  );

  console.log("Burn nft Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  return wasmEvent;
};
