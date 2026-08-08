import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss'],
})
export class GiftComponent implements OnInit {
  ngOnInit(): void {}

  goToContent(): void {
    document.getElementById('gift-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  goToPlans(): void {
    document.getElementById('plans')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
