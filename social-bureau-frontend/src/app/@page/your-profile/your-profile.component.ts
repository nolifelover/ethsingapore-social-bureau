import { AuthService } from "src/app/@service/auth.service";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ApiService } from "src/app/@service/api.service";
import { ToastService } from "src/app/@service/toast.service";
import {
  UserProfileFormType,
  UserProfileInputType,
} from "src/app/@type/auth.type";
import { sleep } from "src/app/@utility/sleep";
import { createMask } from "@ngneat/input-mask";
import { FormService } from "src/app/@service/form.service";
import { errorFormat } from "src/app/@utility/error-format";
import { ToastType } from "src/app/@model/toast";
import { scamTypes } from "src/app/@constant/report";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-your-profile",
  templateUrl: "./your-profile.component.html",
  styleUrls: ["./your-profile.component.scss"],
})
export class YourProfileComponent implements OnInit {
  @ViewChild("imageInput") imageInputRef: ElementRef;
  readonly scamTypeOptions = scamTypes;

  fetching = true;
  error = false;
  submitting = false;
  uploading = false;

  mobilePhoneMask = createMask("099 999 9999");

  profileForm: FormGroup<UserProfileFormType> = this.fb.nonNullable.group({
    mobilePhone: [""],
    profileImage: [""],
    firstname: ["", [Validators.required]],
    lastname: ["", [Validators.required]],
    email: [""],
    interestingScamType: [
      Array<string>(),
      [Validators.required, Validators.minLength(1)],
    ],
  });

  constructor(
    private toastService: ToastService,
    private apiService: ApiService,
    public formService: FormService,
    private fb: FormBuilder,
    private authService: AuthService,
    private modalService: NgbModal
  ) {}

  async ngOnInit() {
    this.modalService.dismissAll();
    await sleep(500);
    const user = this.authService.user;
    this.profileForm.patchValue({
      profileImage: user.profileImage || "",
      firstname: user.firstname || "",
      lastname: user.lastname || "",
      mobilePhone: user.mobilePhone || "",
      email: user.email || "",
      interestingScamType: user.interestingScamType || [],
    });
    this.fetching = false;
  }

  async onInputImages(event: Event) {
    try {
      this.uploading = true;
      const element = event.currentTarget as HTMLInputElement;
      const fileList: FileList = element.files;
      const fileListAsArray = Array.from(fileList);
      const paths = await this.apiService.uploadProfileImages(fileListAsArray);
      this.profileForm.patchValue({ profileImage: paths[0] });
    } catch (error) {
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.uploading = false;
    }
  }

  onRemoveImages(uri: string) {
    this.profileForm.patchValue({ profileImage: "" });
    this.apiService.deleteImages(uri);
    if (!!this.imageInputRef) {
      this.imageInputRef.nativeElement.value = "";
    }
  }

  onSelectScamType(scamType: string) {
    const interestingScamType = [...this.profileForm.value.interestingScamType];

    if (!interestingScamType.includes(scamType)) {
      interestingScamType.push(scamType);
    } else {
      const index = interestingScamType.indexOf(scamType);
      interestingScamType.splice(index, 1);
    }

    this.profileForm.patchValue({ interestingScamType });
  }

  isActiveScamType(scamType: string) {
    return this.profileForm.value.interestingScamType.includes(scamType);
  }

  async handleSubmit() {
    try {
      if (!this.profileForm.valid) {
        this.profileForm.markAllAsTouched();
        return;
      }

      this.submitting = true;
      const { value } = this.profileForm;

      await this.apiService.updateUserProfile(
        this.authService.user.uid,
        value as UserProfileInputType
      );

      const userInfo = await this.apiService.getUserInfo();
      this.authService.user = userInfo;

      this.toastService.show(
        "Success",
        "Update profile successfully",
        3,
        ToastType.Success
      );
    } catch (error) {
      this.toastService.show("An error occurred.", errorFormat(error).message);
    } finally {
      this.submitting = false;
    }
  }
}
