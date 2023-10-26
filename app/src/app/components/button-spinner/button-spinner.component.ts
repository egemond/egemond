import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: "button-spinner",
  templateUrl: "./button-spinner.component.html",
  styleUrls: ["./button-spinner.component.css"]
})
export class ButtonSpinnerComponent {
  @Input() variant: string = "primary";
  @Input() type: string = "button";
  @Input() label: string;

  @Input() classes: string;

  @Input() loading: boolean = false;

  @Output() click = new EventEmitter<void>;

  public clickAction() {
    this.click.emit();
  }
}
