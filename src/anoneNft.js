import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { calculateFee, GasPrice } from "@cosmjs/stargate";
import { AnoneTestnetInfo } from "./chain.info.anonetestnet";

export async function connectWallet() {
  console.log("Connecting wallet...");
  try {
    if (window) {
      if (window["keplr"]) {
        if (window.keplr["experimentalSuggestChain"]) {
          await window.keplr.experimentalSuggestChain(this.chainMeta);
          await window.keplr.enable(this.chainMeta.chainId);
          this.offlineSigner = await window.getOfflineSigner(
            this.chainMeta.chainId
          );
          this.wasmClient = await SigningCosmWasmClient.connectWithSigner(
            this.rpc,
            this.offlineSigner
          );
          this.accounts = await this.offlineSigner.getAccounts();

          console.log("Wallet connected", {
            offlineSigner: this.offlineSigner,
            wasmClient: this.wasmClient,
            accounts: this.accounts,
            chain: this.chainMeta,
          });
          // Query ref.
          this.handlers.query =UploadResult
            this.wasmClient.queryClient.wasm.queryContractSmart;
          // Gas
          this.gas.price = GasPrice.fromString("0.002uan1");
          // Debug
          console.log("dApp Initialized", {
            user: this.accounts[0].address,
            client: this.wasmClient,
            handlers: this.handlers,
            gas: this.gas,
          });

          // Anone testnet account balances ('uan1')
          if (this.accounts.length) {
            await this.getBalances();
          }

          // User and market NFTs
          await this.loadNfts();
        } else {
          console.warn(
            "Error access experimental features, please update Keplr"
          );
        }
      } else {
        console.warn("Error accessing Keplr");
      }
    } else {
      console.warn("Error parsing window object");
    }
  } catch (e) {
    console.error("Error connecting to wallet", e);
  }
}

export async function getBalance() {
  if (!this.chainMeta) {
    return;
  } else if (!this.chainMeta["chainName"]) {
    return;
  } else if (!this.chainMeta["currencies"]) {
    return;
  } else if (!this.chainMeta.currencies.length) {
    return;
  }
  this.loading = {
    status: true,
    msg: "Updating account balances...",
  };
  if (this.accounts) {
    if (this.accounts.length) {
      for (let i = 0; i < this.accounts.length; i++) {
        if (this.accounts[i]["address"]) {
          try {
            console.log("address", this.accounts[i].address);
            let balance = await this.wasmClient.getBalance(
              this.accounts[i].address,
              this.chainMeta.currencies[0].coinMinimalDenom
            );
            this.accounts[i].balance = balance;
            this.loading.status = false;
            this.loading.msg = "";
            console.log("Balance updated", this.accounts[i].balance);
          } catch (e) {
            console.warn("Error reading account address", [
              String(e),
              this.accounts[i],
            ]);
            this.loading.status = false;
            this.loading.msg = "";
            return;
          }
        } else {
          console.warn(
            "Failed to resolve account address at index " + i,
            this.accounts[i]
          );
        }
      }
    } else {
      this.loading.status = false;
      this.loading.msg = "";
      console.warn("Failed to resolve Keplr wallet");
    }
  } else {
    this.loading.status = false;
    this.loading.msg = "";
    console.warn("Failed to resolve Keplr wallet");
  }
}


