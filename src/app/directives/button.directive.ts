import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: '[button-side-to-side]',
  standalone: true
})
export class ButtonSideToSideDirective {
    @HostBinding('class.animate-side-to-side') sideToSide = true; // magic
}