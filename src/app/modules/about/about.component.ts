import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent implements OnInit {
  constructor(
    private router: Router,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {}

  goToContent(): void {
    document.getElementById('about-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToSignUp(): void {
    if (this.auth.currentUserValue) {
      this.router.navigate(['memories/new/']);
      return;
    }

    this.router.navigate(['/auth/registration']);
  }

  goToMemories(): void {
    this.router.navigate(['/memories']);
  }

  goToStandBy(): void {
    this.router.navigate(['/giftvoucher']);
  }
}
