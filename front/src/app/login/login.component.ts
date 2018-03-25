import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Credentials } from '../model/credentials';
import { AuthService } from '../services/auth.service';
import { ToastFactory } from '../shared/toast-factory';
import { FormValidateUtils } from '../shared/form-validate-utils';
import {User} from "../model/user";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  private credentials: Credentials;
  formValidateUtils: FormValidateUtils;

  form: FormGroup;

  constructor(
      private authService: AuthService,
      private formBuilder: FormBuilder,
      private router: Router) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.formValidateUtils = new FormValidateUtils(this.form);
  }

  onSubmit() {
    if(this.form.valid) {
      const email = this.form.get('email').value;
      const password = this.form.get('password').value;

      this.credentials = new Credentials(email, password);

      this.authService.doLogin(this.credentials).subscribe(
        (data: User) => {
          console.log(data);
          this.authService.userAuthenticated = true;
          this.router.navigate(['/projects']);
        },
        err => {
          console.log(err);
          if(err.error.message) {
            ToastFactory.errorToast(err.error.message);
          }
        }
      );

      this.router.navigate(['/projects']);
      const result = this.authService.doLogin(this.credentials);

      if(result) {

      } else {
        ToastFactory.errorToast("Login Unsuccessful. Check login and password and try again", 5000);
      }
    } else {
      this.formValidateUtils.checkAllFields(this.form);
    }
  }

  showError(field: string): boolean {
    return this.formValidateUtils.checkInvalidAndTouchedField(field);
  }

  buildErrorMessage(field: string): string {
    return this.formValidateUtils.buildErrorMessage(field);
  }

  addClassError(field: string) {
    let result = this.showError(field);
    return {
      invalid: result
    }
  }
}
