import { v4 as uuid } from 'uuid';

export class User {

  id: string;

  constructor(public name: string, public avatarSrc: string) {
    this.id = uuid();
  }
}
