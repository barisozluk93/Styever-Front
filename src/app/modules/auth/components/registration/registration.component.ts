import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ConfirmPasswordValidator } from './confirm-password.validator';
import { first } from 'rxjs/operators';
import { UserModelAuth } from '../../models/user.model';
import { UserAddressModel } from 'src/app/modules/user-management/models/user-address.model';
import { UserModel } from 'src/app/modules/user-management/models/user.model';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  registrationForm: FormGroup;
  addressForm: FormGroup;
  hasError: boolean;
  isLoading$: Observable<boolean>;

  activeState: string = 'paymentPlan';
  activePlan: string = 'standard';
  totalPrice: number = 359.00;

  // private fields
  private unsubscribe: Subscription[] = []; // Read more: => https://brianflove.com/2016/12/11/anguar-2-unsubscribe-observables/

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.isLoading$ = this.authService.isLoading$;
    // redirect to home if already logged in
    if (this.authService.currentUserValue) {
      this.router.navigate(['/']);
    }
  }

  changeState(state: string) {
    this.activeState = state;
  }

  ngOnInit(): void {
    this.initForm();
  }

  onPlanSelect(plan: string) {
    this.activePlan = plan;

    if (this.activePlan == 'standard') {
      this.totalPrice = 359.00;
    }
    else if (this.activePlan == 'premium') {
      this.totalPrice = 559.00;
    }
    else if (this.activePlan == 'ultra') {
      this.totalPrice = 959.00;
    }
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registrationForm.controls;
  }

  initForm() {
    this.addressForm = this.fb.group({
      id: 0,
      country: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      city: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      addressHeader: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      address: [
        "",
        Validators.compose([
          Validators.required,
        ]),
      ],
      district: [
        undefined,
        Validators.compose([
          Validators.required,
        ]),
      ],
      isDeleted: false
    });

    this.registrationForm = this.fb.group(
      {
        phone: [
          "",
          Validators.compose([
            Validators.required,
          ]),
        ],
        name: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        surname: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        cPassword: [
          '',
          Validators.compose([
            Validators.required,
          ]),
        ],
        agree: [false, Validators.compose([Validators.required])],
      },
      {
        validator: ConfirmPasswordValidator.MatchPassword,
      }
    );

    this.paymentForm = this.fb.group(
      {
        fullname: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(100),
          ]),
        ],
        cardno: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(16),
            Validators.maxLength(16),
          ]),
        ],
        expiryDate: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(4),
          ]),
        ],
        cvv: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(3),
          ]),
        ]
      });
  }

  submit() {
    this.hasError = false;
    var newUser = this.registrationForm.getRawValue() as UserModel;
    newUser.roles = this.activePlan == 'standard' ? [1] : (this.activePlan == 'premium' ? [2] : [3]); 
    newUser.username = newUser.email;
    newUser.userAddress = this.addressForm.getRawValue() as UserAddressModel;

    const registrationSubscr = this.authService
      .registration(newUser)
      .pipe(first())
      .subscribe((user: UserModelAuth) => {
        if (user) {
          this.router.navigate(['/']);
        } else {
          this.hasError = true;
        }
      });
    this.unsubscribe.push(registrationSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
