import { MessagesService } from './messages.services';

import { Message } from './message.model';
import { Thread } from '../thread/thread.model';
import { User } from '../user/user.model';

describe('MessagesService', () => {
  it('should test', () => {
    const thread: Thread = new Thread('t1', 'Nate', '');
    const user: User = new User('Nate', 'a');
    const m1: Message = new Message({
      author: user,
      text: 'hi!',
      thread: {thread}
    });

    const m2: Message = new Message({
      author: user,
      text: 'hi 2!',
      thread: {thread}
    });

    const messagesService = new MessagesService();

    messagesService.newMessages
      .subscribe((message: Message) => {
        console.log('newMessages: ' + message.text);
      });

    messagesService.messages
      .subscribe((messages: Message[]) => {
        console.log('messages: ' + messages.length);
      });

    messagesService.addMessage(m1);
    messagesService.addMessage(m2);
  });
});
