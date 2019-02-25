import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { filter, publishReplay, map, scan, refCount } from 'rxjs/operators';
import { User } from '../user/user.model';
import { Thread } from '../thread/thread.model';
import { Message } from './message.model';

const initialMessages: Message[] = [];

type IMessagesOperation = (messages: Message[]) => Message[];

@Injectable()
export class MessagesService {

  newMessages: Subject<Message> = new Subject<Message>();
  messages: Observable<Message[]>;
  updates: Subject<any> = new Subject<any>();

  create: Subject<Message> = new Subject<Message>();
  markThreadAsRead: Subject<any> = new Subject<any>();

  constructor() {

    this.messages = this.updates.
      pipe(
        scan(
          (messages: Message[], operation: IMessagesOperation) => {
            return operation(messages);
          },
          initialMessages)
      ).pipe(publishReplay(1))
      .pipe(refCount());

    this.create.pipe(
      map(
        function (message: Message): IMessagesOperation {
          return (messages: Message[]) => {
            return messages.concat(message);
          };
        })
    ).subscribe(this.updates);

    this.newMessages.subscribe(this.create);

    this.markThreadAsRead.pipe(
      map((thread: Thread) => {
        return (messages: Message[]) => {
          return messages.map((message: Message) => {
            if (message.thread.id === thread.id) {
              message.isRead = true;
            }
            return message;
          });
        };
      })
    ).subscribe(this.updates);
  }

  addMessage(message: Message): void {
    this.newMessages.next(message);
  }

  messagesForThreadUser(thread: Thread, user: User): Observable<Message> {
    return this.newMessages
      .pipe(
        filter((message: Message) => {
          return (message.thread.id === thread.id)
            &&
            (message.author.id === user.id);
        })
      );
  }

}

export const userServiceInjectables: Array<any> = [
  MessagesService
];

