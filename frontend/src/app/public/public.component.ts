import { Component } from '@angular/core';
import { HeaderComponent } from '../core/components/header/header.component';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-public',
  imports: [
    RouterModule
  ],
  templateUrl: './public.component.html',
  styleUrl: './public.component.css'
})
export class PublicComponent {
  showHeader = true;

}
