import { EventEmitter, Injectable } from '@angular/core';
import { Message } from './message.model';
import { MOCKMESSAGES } from './MOCKMESSAGES';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
  messageChangedEvent = new EventEmitter<Message[]>();
  maxMessageId: number;

  constructor(private http: HttpClient) {
    this.messages = MOCKMESSAGES;
  }

  getMessages(): any {
    this.http.get<{ message: string; messages: Message[] }>('http://localhost:3000/messages')
      .subscribe(
        (response) => {
          console.log("Full API Response for Messages:", response); // Debugging output
  
          if (!response || !Array.isArray(response.messages)) {
            console.error("Invalid API response format for messages:", response);
            this.messages = [];
            return;
          }
  
          this.messages = response.messages;
          this.maxMessageId = this.getMaxId();
  
          // Emit updated message list
          this.messageChangedEvent.next([...this.messages]);
        },
        (error) => {
          console.error('Error fetching messages:', error);
          this.messages = []; // Prevents null reference issues
        }
      );
  }
  

  storeMessages() {
    let messages = JSON.stringify(this.messages);
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    this.http.put('https://jw-cms-5d7d3-default-rtdb.firebaseio.com/messages.json', messages, {
      headers: headers
    }).subscribe(() => {
    this.messageChangedEvent.next(this.messages.slice());
    });
  }

  getMessage(id: string): Message {
    for (let message of this.messages) {
      if (message.id === id) {
        return message;
      }
    }
    return null;
  }

  addMessage(message: Message) {
    if (!message) {
      return;
    }
  
    // Make sure id of the new Message is empty
    message.id = '';  // You may want to set it as an empty string or leave it for the server to generate.
  
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
  
    // Add to database
    this.http.post<{ message: string, messages: Message }>('http://localhost:3000/messages', 
      message,
      { headers: headers })
      .subscribe(
        (responseData) => {
          // Add new message to messages array
          this.messages.push(responseData.messages);
          this.sortAndSend(); 
        },
        (error) => {
          console.error('Error adding message:', error);
        }
      );
  }

  private sortAndSend() {
    this.messages.sort((a, b) => a.id.localeCompare(b.id)); // Sort documents alphabetically
    this.messageChangedEvent.next(this.messages.slice()); // Emit the updated list
  }
  

  getMaxId(): number {
    let maxId = 0;
    for (let message of this.messages) {
      let currentId = parseInt(message.id);
      if (currentId > maxId) {
        maxId = currentId;
      }
    }
    return maxId;
  }
}
