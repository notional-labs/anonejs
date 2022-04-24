import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { getWasmClient } from "../utils/getKeplr";

export const cancelSale = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = await getWasmClient();
  console.log(wasmClient);
  const gasPrice = GasPrice.fromString("0.002uan1");

  let entrypoint = {
    withdraw_nft: {
      offering_id: Config.offering_id
    }
  };

  const txFee = calculateFee(3000000, gasPrice);

  const result = await wasmClient.execute(
    account,
    Config.nftMarketplaceContractAddr,
    entrypoint,
    txFee,
    "cancel sale"
  );

  console.log("cancel sale Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  return wasmEvent;
};
