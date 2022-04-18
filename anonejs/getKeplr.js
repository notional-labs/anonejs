import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { anoneTestnetChain } from "./anone_testnet";

export const getKeplr = async () => {
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Keplr Wallet not detected, please install extension");
        return {
            accounts: null
        }
    } else {
        await window.keplr.experimentalSuggestChain(anoneTestnetChain)
        await window.keplr.enable(process.env.REACT_APP_CHAIN_ID)
        let offlineSigner = await window.getOfflineSigner(process.env.REACT_APP_CHAIN_ID);
        let accounts = await offlineSigner.getAccounts()
        accounts.chain = process.env.REACT_APP_CHAIN_ID
        return {
            accounts,
            offlineSigner,
        };
    }
}


export const getWasmClient = async () => {
    let offlineSigner = await window.getOfflineSigner(process.env.REACT_APP_CHAIN_ID);
    const wasmClient = await SigningCosmWasmClient.connectWithSigner(anoneTestnetChain.rpc, offlineSigner);
    return wasmClient
}

