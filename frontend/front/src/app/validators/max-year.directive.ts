import { Directive, forwardRef } from '@angular/core';
import { Validator, AbstractControl, NG_VALIDATORS, ValidationErrors } from '@angular/forms';


function validateMaxYear(control: AbstractControl): ValidationErrors | null {
  if (!control.value) {
    return null; 
  }

 
  const date = new Date(control.value);
  
 
  if (isNaN(date.getTime()) || date.getFullYear() > 9999) {
   
    return { 'maxYear': { message: 'O ano não pode ter mais de 4 dígitos.' } };
  }

  return null; 
}

@Directive({
  selector: '[appMaxYear][ngModel]', 
  standalone: true,
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxYearDirective),
      multi: true
    }
  ]
})
export class MaxYearDirective implements Validator {

  
  validate(control: AbstractControl): ValidationErrors | null {
    return validateMaxYear(control);
  }
}
