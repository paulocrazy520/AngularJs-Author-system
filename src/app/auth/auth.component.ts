import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

interface UserDto {
  username: string;
  email: string;
  type: 'user' | 'admin';
  password: string;
}

@Component({
  selector: 'app-auth',
  templateUrl: '../auth.component.html',
  styleUrls: ['../auth.component.css'],
})

export class AuthComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  authForm = this.formBuilder.group({});
  isSubmitted = true;
  user = {};
  pwdPattern =
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*[~`!@#$%^&*()--+={}\[\]|\\:;"'<>,.?/_₹]).*$/;

  get formControls() {
    return this.authForm.controls;
  }

  ngOnInit() {
    console.log('ngOnInit');

    this.authForm = this.formBuilder.group({
      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(25),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      type: ['', Validators.required],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(24),
          Validators.pattern(this.pwdPattern),
        ],
      ],
      button: ['Login', Validators.required],
    });
  }

  private async createUser(user: UserDto) {
    let control = this.authForm.controls.button;
    control.disable();

    console.log('**********Createing User Starting...*************', user);

    await new Promise((res) => setTimeout(res, 2500));

    console.log('**********TimeOut End*************');

    if (Math.random() < 0.5) {
      console.log('**********Request Failed*************', user);

      control.enable();
      return Promise.reject('**********Request Failed**********');
    }
    control.enable();

    console.log('**********Request success*************');
    // Backend call happening here.
    ///////////////////////////////
    return { username: user.username, email: user.email, type: user.type };
  }

  async signIn() {
    this.isSubmitted = true;
    if (this.authForm.invalid) {
      console.log('**********Validator Error**********', this.authForm.value);
      return;
    }

    this.user = await this.createUser(this.authForm.value);
    console.log('success', this.user);
    this.authService.signIn(this.authForm.value);
    this.router.navigateByUrl('/admin');
  }
}
