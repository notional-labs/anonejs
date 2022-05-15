import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { getWasmClient } from "../utils/getKeplr";

export const createModel = async (Config) => {
  const account = JSON.parse(localStorage.getItem("account")).account.address;
  const wasmClient = await getWasmClient();
  const gasPrice = GasPrice.fromString("0.002uan1");

  let entrypoint = {
    create_model: {
        model_id: Config.modelId,
        model_uri: Config.modelUri
    },
  };

  const txFee = calculateFee(300000, gasPrice);

  const result = await wasmClient.execute(
    account,
    Config.minterContract,
    entrypoint,
    txFee,
    "create model"
  );

  console.log("Create model for collection Tx", result);
  const wasmEvent = result.logs[0].events.find((e) => e.type === 'wasm');
  return wasmEvent;
};
