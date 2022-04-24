import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { getWasmClient } from "../utils/getKeplr";

export const updatePrice = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = await getWasmClient();
  console.log(wasmClient);
  const gasPrice = GasPrice.fromString("0.002uan1");

  let entrypoint = {
    update_price: {
      offering_id: Config.offering_id,
      update_price: Config.update_price
    }
  };

  const txFee = calculateFee(3000000, gasPrice);

  const result = await wasmClient.execute(
    account,
    Config.nftMarketplaceContractAddr,
    entrypoint,
    txFee,
    "update price"
  );

  console.log("Update nft's price Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  return wasmEvent;
};