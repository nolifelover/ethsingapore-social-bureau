import { ScrollToModule } from "@nicky-lenaers/ngx-scroll-to";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { InputMaskModule } from "@ngneat/input-mask";
import { NgbDropdownModule, NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// pipe
import { HideAddressPipe } from "./@pipe/hide-address.pipe";
import { ImageUriPipe } from "./@pipe/image-uri.pipe";

// interceptor
import { AuthorizationInterceptor } from "./@interceptor/authorization.interceptor";
import { ErrorInterceptor } from "./@interceptor/error.interceptor";

// page
import { Page404Component } from "./@page/page404/page404.component";
import { ReportCrimeComponent } from "./@page/report-crime/report-crime.component";
import { CrimesComponent } from "./@page/crimes/crimes.component";
import { CrimeDetailComponent } from "./@page/crime-detail/crime-detail.component";
import { StakeComponent } from "./@page/stake/stake.component";

// component
import { ConnectWalletButtonComponent } from "./@component/connect-wallet-button/connect-wallet-button.component";
import { ConnectedNetworkComponent } from "./@component/connected-network/connected-network.component";
import { FooterComponent } from "./@component/footer/footer.component";
import { HeaderComponent } from "./@component/header/header.component";
import { SpinnerComponent } from "./@component/spinner/spinner.component";
import { BackgroundCheckComponent } from "./@page/background-check/background-check.component";
import { YourProfileComponent } from "./@page/your-profile/your-profile.component";
import { BankTransferFormComponent } from "./@component/bank-transfer-form/bank-transfer-form.component";
import { CreditCardFormComponent } from "./@component/credit-card-form/credit-card-form.component";
import { ElectronicPaymentFormComponent } from "./@component/electronic-payment-form/electronic-payment-form.component";
import { CryptocurrencyFormComponent } from "./@component/cryptocurrency-form/cryptocurrency-form.component";
import { OthersPaymentFormComponent } from "./@component/others-payment-form/others-payment-form.component";
import { ReportCardComponent } from "./@component/report-card/report-card.component";
import { ReportCommentComponent } from "./@component/report-comment/report-comment.component";
import { ToastComponent } from "./@component/toast/toast.component";
import { ErrorComponent } from "./@component/error/error.component";
import { EmptyComponent } from "./@component/empty/empty.component";
import { CreateCommentModalComponent } from "./@component/create-comment-modal/create-comment-modal.component";
import { ConnectWalletModalComponent } from "./@component/connect-wallet-modal/connect-wallet-modal.component";
import { BecomeInspectorModalComponent } from "./@component/become-inspector-modal/become-inspector-modal.component";
import { HistoryComponent } from "./@page/history/history.component";
import { RegisterNoticeModalComponent } from "./@component/register-notice-modal/register-notice-modal.component";

@NgModule({
  declarations: [
    AppComponent,

    // pipe
    HideAddressPipe,
    ImageUriPipe,

    // page
    Page404Component,
    ReportCrimeComponent,
    BackgroundCheckComponent,
    YourProfileComponent,
    CrimesComponent,
    CrimeDetailComponent,
    StakeComponent,

    // component
    HeaderComponent,
    FooterComponent,
    ConnectWalletButtonComponent,
    ConnectedNetworkComponent,
    SpinnerComponent,
    ReportCommentComponent,
    BankTransferFormComponent,
    CreditCardFormComponent,
    ElectronicPaymentFormComponent,
    CryptocurrencyFormComponent,
    OthersPaymentFormComponent,
    ReportCardComponent,
    ToastComponent,
    ErrorComponent,
    EmptyComponent,
    CreateCommentModalComponent,
    ConnectWalletModalComponent,
    BecomeInspectorModalComponent,
    HistoryComponent,
    RegisterNoticeModalComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    InputMaskModule,
    NgbDropdownModule,
    ScrollToModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthorizationInterceptor,
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

declare global {
  interface Window {
    web3: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
    ethereum: any; // eslint-disable-line  @typescript-eslint/no-explicit-any
  }
}
