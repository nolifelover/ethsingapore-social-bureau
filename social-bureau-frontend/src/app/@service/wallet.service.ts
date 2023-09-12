import { Injectable } from "@angular/core";

import { Subject } from "rxjs";
import { ethers } from "ethers";
import { Logger } from "./logger.service";
import { SUPPORT_CHAINS } from "../@constant/chains";
import { AuthRespData, SinginRespData } from "../@type/auth.type";
import { ApiService } from "./api.service";
import { AuthService } from "./auth.service";

const log = new Logger("WalletService");

@Injectable({
  providedIn: "root",
})
export class WalletService {
  public provider: ethers.providers.Web3Provider;
  public publicProvider;

  public account: string;
  public accountSubject = new Subject<string>();

  public chain: number;
  public chainSubject = new Subject<number>();

  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  async getProvider() {
    if (!this.provider) {
      await this.initProvider();
    }
    return this.provider;
  }

  async getPublicProvider() {
    if (!this.publicProvider) {
      await this.initPublicProvider();
    }
    return this.publicProvider;
  }

  async connectWallet() {
    log.debug("Set local storage to connected state");
    localStorage.setItem("connectStatus", "1");
    const _account = await this.getAccount();
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");

    try {
      const respSingin = await this.apiService.singinWithPublicAddress(
        _account
      );

      if (respSingin.status != 200) {
        throw new Error(respSingin.message);
      }

      const signer = this.provider.getSigner();
      const singinResp: SinginRespData = respSingin.data as SinginRespData;
      const signature = await signer.signMessage(singinResp.msg);

      const respAuth = await this.apiService.authenWithPublicAddress(
        _account,
        signature
      );

      if (respAuth.status != 200) {
        throw new Error(respAuth.message);
      }
      const authData = respAuth.data as AuthRespData;
      this.authService.setCredential(authData);
      await this.updateConnectedWallet(_account);
      window.location.reload();
    } catch (error) {
      log.error(error);
    }

    return _account;
  }

  async disconnectWallet() {
    localStorage.setItem("connectStatus", "0");
    this.accountSubject.next(null);
    this.account = null;
    this.authService.logout();
  }

  async getAccount() {
    const enableWallet = localStorage.getItem("connectStatus");
    if (enableWallet === "1") {
      if (!this.provider) {
        await this.initProvider();
      }
      this.account = await this.getCurrentConnectedAccount();
    }
    log.debug("return account ", this.account);
    return this.account;
  }

  getChainSubject() {
    return this.chainSubject.asObservable();
  }

  getAccountSubject() {
    return this.accountSubject.asObservable();
  }

  async updateConnectedWallet(walletAddress: string) {
    log.debug("updateConnectedWallet walletAddress => %o", walletAddress);

    this.account = walletAddress;
    this.accountSubject.next(walletAddress);
    //await this.getCurrentChain()
  }

  async getChainId() {
    try {
      this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
      const _chainId = await this.provider.getNetwork();
      return _chainId.chainId;
    } catch (e) {
      log.error(e);
      return 0;
    }
  }

  async getChainInfo() {
    const id = await this.getChainId();
    const chains = SUPPORT_CHAINS;
    const chain = chains.find((ch) => {
      return ch.chainIdNumber == id;
    });
    return chain;
  }

  async switchNetwork(network) {
    try {
      // check if the chain to connect to is installed
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: network.chainId }], // chainId must be in hexadecimal numbers
      });
    } catch (error) {
      const errorCode = error.data
        ? error.data?.originalError
          ? error.data?.originalError?.code
          : 0
        : 0;
      if (
        error.code === 4902 ||
        errorCode == 4902 ||
        error.code === -32603 ||
        errorCode == -32603
      ) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: network.chainId,
                chainName: network.chainName,
                rpcUrls: network.rpcUrls,
                nativeCurrency: network.nativeCurrency,
                blockExplorerUrls: network.blockExplorerUrls,
              },
            ],
          });
        } catch (addError) {
          log.error("error on add chain: %o", addError);
        }
      }
    }
  }

  private async initProvider() {
    log.debug("Init provider");
    this.provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    this.provider.on("network", async (newNetwork, oldNetwork) => {
      log.debug("network changed to " + newNetwork.chainId);
      if (oldNetwork) {
        log.debug(
          "Chain changed from " +
            oldNetwork.chainId +
            " to " +
            newNetwork.chainId
        );
        this.chainSubject.next(newNetwork);
        await this.initPublicProvider();
      }
    });
  }

  private async initPublicProvider() {
    const currentChainInfo = await this.getChainInfo();
    this.publicProvider = new ethers.providers.JsonRpcProvider(
      currentChainInfo.rpcUrls[0]
    );
  }

  private async getCurrentConnectedAccount() {
    try {
      if (this.provider) {
        const _accounts = await this.provider.send("eth_requestAccounts", []);
        return _accounts[0];
      }
    } catch (error) {
      log.error(`error on get currentConnectedAccount`, error);
    }
  }
}
