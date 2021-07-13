import {AbstractControl, ValidatorFn,ValidationErrors} from '@angular/forms';

const ALPHA_NUMERIC_REGEX = /^[a-zA-Z0-9_]*$/;

export class FormControlValidators {
  static matchValueValidators(matchTo: string) : (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl) : ValidationErrors | null => {
      return !!control && !!control.parent.value &&
      control.value === control.parent.controls[matchTo].value ? null : {'matchValue' : false}
    }
  }
  static aphaNumbericValidators(value: string): (AbstractControl) => ValidationErrors | null {
    return (control:AbstractControl): ValidationErrors | null => {
      return ALPHA_NUMERIC_REGEX.test(value) ? null : {'aphaNumberic' : false}
    }
  }
}
