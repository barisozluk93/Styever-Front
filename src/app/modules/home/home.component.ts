import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(private router: Router, private auth: AuthService) {}

  ngOnInit(): void {}

  goToOffers(): void {
    document.getElementById('offers')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToSignUp(): void {
    if (this.auth.currentUserValue) {
      this.router.navigate(['memories/new/']);
      return;
    }
    this.router.navigate(['/auth/registration']);
  }

  goToAbout(): void { this.router.navigate(['/about']); }
  goToMemories(): void { this.router.navigate(['/memories']); }
  goToStandBy(): void { this.router.navigate(['/giftvoucher']); }
}
