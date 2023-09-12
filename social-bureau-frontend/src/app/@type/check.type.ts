import { FormControl } from "@angular/forms";

export type CheckInputType = {
  keyword: string;
  category: string;
};

export type CheckFormType = {
  keyword: FormControl<string>;
  category: FormControl<string>;
};
