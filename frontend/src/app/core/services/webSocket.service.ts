import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  //[x: string]: any;
  readonly uri: string = "ws://localhost:3000";
  private socket: Socket;
  socketSubject: Subject<any> = new Subject<any>();

  constructor(private authService: AuthService) {
    this.socket = io(this.uri);
    const userId = this.authService.getSession().user.id;
    this.socket.emit('join-room', userId);
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
        this.socket.on(eventName, (data) => {
            subscriber.next(data);
        });
    });
  }
  
  // onMemberAdded(callback: (data: any) => void): void {
  //   this.socket.on('member-added', callback);
  // }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}