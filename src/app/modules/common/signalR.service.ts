import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationSignalrService {

  private hubConnection!: signalR.HubConnection;

  private notificationSource = new BehaviorSubject<any>(null);
  notification$ = this.notificationSource.asObservable();

  private unreadCountSource = new BehaviorSubject<number>(0);
  unreadCount$ = this.unreadCountSource.asObservable();

  startConnection(token: string) {

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('http://192.168.1.118:5029/notificationHub', {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start()
      .then(() => console.log("SignalR connected"))
      .catch(err => console.log(err));

    this.registerEvents();
  }

  private registerEvents() {

    this.hubConnection.on("notificationReceived", (notification) => {
      console.log("Yeni bildirim:", notification);
      this.notificationSource.next(notification);
    });

    this.hubConnection.on("unreadCountChanged", (count) => {
      console.log("Unread count:", count);
      this.unreadCountSource.next(count);
    });

  }

}