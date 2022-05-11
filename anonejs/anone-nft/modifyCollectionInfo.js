import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { getWasmClient } from "../utils/getKeplr";

export const modifyCollectionInfo = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = await getWasmClient();
  console.log(wasmClient);
  const gasPrice = GasPrice.fromString("0.002uan1");

  const royaltyInfo = {
    payment_address: Config.royaltyPaymentAddress,
    share: Config.royaltyShare
  };

  let entrypoint = {
    modify_collection_info: {
        description: Config.description,
        image: Config.image,
        external_link: Config.externalLink,
        royalty_info: royaltyInfo
    }
  };

  const txFee = calculateFee(3000000, gasPrice);

  const result = await wasmClient.execute(
    account,
    Config.cw721ContractAddr,
    entrypoint,
    txFee,
    "modify collection info"
  );

  console.log("Modify collection info Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  return wasmEvent;
};
