import { Component, OnInit } from "@angular/core";
import { ContractService } from "../../@service/contract.service";
import { WalletService } from "../../@service/wallet.service";
import { ToastService } from "../../@service/toast.service";
import { errorFormat } from "../../@utility/error-format";
import { ToastType } from "../../@model/toast";
import { Logger } from "../../@service/logger.service";

const log = new Logger("StakeComponent");

@Component({
  selector: "app-stake",
  templateUrl: "./stake.component.html",
  styleUrls: ["./stake.component.scss"],
})
export class StakeComponent implements OnInit {
  error = false;
  fetching = false;
  isInspector = false;

  constructor(
    private walletService: WalletService,
    private contractService: ContractService,
    private toastService: ToastService
  ) {}

  async ngOnInit() {
    await this.fetchData();
  }

  async fetchData() {
    this.fetching = true;
    await this.checkIfInspector();
    this.fetching = false;
  }

  async checkIfInspector() {
    this.isInspector = await this.contractService.isInspector(
      await this.walletService.getAccount()
    );
  }

  async zap() {
    this.fetching = true;
    this.contractService
      .zap()
      .then(async (transaction) => {
        const receipt = await transaction.wait();
        const event = receipt.events.find((e) => e.event === "Zapped");
        if (event) {
          this.toastService.show(
            "Success Zap",
            "Stake successfully",
            3,
            ToastType.Success
          );
        }
        await this.fetchData();
      })
      .catch((error) => {
        log.error(error);
        this.toastService.show(
          "An error occurred.",
          errorFormat(error).message
        );
      })
      .finally(() => {
        this.fetching = false;
      });
  }

  async unstake() {
    this.fetching = true;
    this.contractService
      .unstake()
      .then(async (transaction) => {
        const receipt = await transaction.wait();
        const event = receipt.events.find((e) => e.event === "Unstaked");
        if (event) {
          this.toastService.show(
            "Success Unstake",
            "Unstake successfully",
            3,
            ToastType.Success
          );
        }
        await this.fetchData();
      })
      .catch((error) => {
        log.error(error);
        this.toastService.show(
          "An error occurred.",
          errorFormat(error).message
        );
      })
      .finally(() => {
        this.fetching = false;
      });
  }
}
