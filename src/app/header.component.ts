import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'cms-header',
  standalone: false,
  
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  collapsed = true;
  @Output() selectedFeatureEvent = new EventEmitter<string>();

  onSelected(selectedEvent: string){
    this.selectedFeatureEvent.emit(selectedEvent);
  }
}
