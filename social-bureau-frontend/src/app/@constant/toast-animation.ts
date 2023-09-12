import {
  AnimationTriggerMetadata,
  trigger,
  state,
  transition,
  style,
  animate,
} from "@angular/animations";

export const toastAnimation: AnimationTriggerMetadata = trigger(
  "toastAnimation",
  [
    state("default", style({ opacity: 1 })),
    transition(":enter", [style({ opacity: 0 }), animate("150ms")]),
    transition(":leave", animate("150ms", style({ opacity: 0 }))),
  ]
);
