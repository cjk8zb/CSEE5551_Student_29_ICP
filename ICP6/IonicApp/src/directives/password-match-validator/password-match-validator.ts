import { Directive } from '@angular/core';
import {AbstractControl, FormGroup, NG_VALIDATORS, ValidationErrors, Validator, ValidatorFn} from "@angular/forms";

/**
 * Generated class for the PasswordMatchValidatorDirective directive.
 *
 * See https://angular.io/api/core/Directive for more info on Angular
 * Directives.
 */
@Directive({
  selector: '[passwordMatchValidator]', // Attribute selector
  providers: [{ provide: NG_VALIDATORS, useExisting: PasswordMatchValidatorDirective, multi: true }]
})
export class PasswordMatchValidatorDirective implements Validator {

  constructor() {
    console.log('Hello PasswordMatchValidatorDirective Directive');
  }
  validate(control: AbstractControl): ValidationErrors {
    // const identityRevealedValidator: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password && confirmPassword && password.value === confirmPassword.value ? null : { 'passwordMatch': true };
    // };

    // return identityRevealedValidator(control)
  }

}
