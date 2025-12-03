import { Injectable } from '@angular/core';
import { fromEvent, map, startWith } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WindowResizeService {

  // window resize eventini observable'a çeviriyoruz
  resize$ = fromEvent(window, 'resize').pipe(
    // İlk değer olarak mevcut genişliği veriyoruz (startWith)
    startWith(null),
    map(() => ({
      width: window.innerWidth,
      height: window.innerHeight
    }))
  );
}