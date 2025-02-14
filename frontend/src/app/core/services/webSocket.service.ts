import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  //[x: string]: any;
  readonly uri: string = "ws://localhost:3000";
  private socket: Socket;

  constructor() {
    this.socket = io(this.uri);
  }

  listen(eventName: string) {
    return new Observable((subscriber) => {
        this.socket.on(eventName, (data) => {
            subscriber.next(data);
        });
    });
  }
  
  onMemberAdded(callback: (data: any) => void): void {
    this.socket.on('member-added', callback);
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}