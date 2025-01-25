import { Component, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { Message } from '../message.model';

@Component({
  selector: 'cms-message-edit',
  standalone: false,
  
  templateUrl: './message-edit.component.html',
  styleUrl: './message-edit.component.css'
})
export class MessageEditComponent {
  @ViewChild('subject') subjectInputRef: ElementRef;
  @ViewChild('msgText') msgTextInputRef: ElementRef;
  @Output() addMessageEvent = new EventEmitter<Message>();

  currentSender = 'Josh Woods';
  
  onSendMessage() {
    const subjectVal = this.subjectInputRef.nativeElement.value;
    const msgTextVal = this.msgTextInputRef.nativeElement.value;
    const newMessage = new Message('1', subjectVal, msgTextVal, this.currentSender);
    this.addMessageEvent.emit(newMessage);
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.msgTextInputRef.nativeElement.value = '';
  }
}
