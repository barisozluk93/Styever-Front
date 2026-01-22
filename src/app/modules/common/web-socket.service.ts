import { Injectable } from "@angular/core";
import { webSocket, WebSocketSubject } from "rxjs/webSocket";
import { AlertService } from "src/app/_metronic/partials/layout/alert/alert.service";
import { NotificationService } from "src/app/_metronic/partials/layout/extras/dropdown-inner/notifications-inner/notification.service";
import { environment } from "src/environments/environment";
import { UserType } from "../auth";

@Injectable({
    providedIn: 'root',
})
export class WebSocketService {

    socket: WebSocketSubject<any>;

    constructor(
        private notificationService: NotificationService,
        private alertService: AlertService
    ) { }

    connectToWebSocket(userId: number) {
        this.socket
        .subscribe({
            next: message => { 
                this.alertService.createAlert("warning", message);
                setTimeout(() => {
                    this.notificationService.updateNotifications(userId);
                }, 500)            
            },
            error: err => { 
                console.log("Web socket errors :" + err)
            },
            complete: () => { 
                console.log("Web socket disconnected")
            }
        });
    }

    openWebSocket(token: string) {
        this.socket = webSocket({
            url: `${environment.wssUrl}?token=${token}`,
            deserializer: msg => msg.data

        });        
        
        var user: UserType = JSON.parse(atob(token.split('.')[1]));
        this.connectToWebSocket(user?.id!); 
    }

    closeWebSocket() {
        if(this.socket) {
            this.socket.complete();
        }
    }
}