import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SocketService } from './core/services/webSocket.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'frontend';

  constructor(private webSocketService: SocketService) {}

  ngOnInit() {
    this.webSocketService.listen('connect').subscribe(() => {
      console.log('Connected to the server');
    });
  }
}
