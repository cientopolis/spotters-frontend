import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MessagesProvider } from '../../providers/messages.provider';
import { Candidate } from '../../models/candidate';
import { Message } from '../../models/message';

@Component({
    selector: 'message-list',
    templateUrl: 'message-list.html'
})
export class MessageListComponent {
    @Input() candidate: Candidate = null;
    @Input() messages: Message[] = [];
    @Input() displayMessages: boolean = false;
    message: string = '';
    errorMessage: string = '';

    constructor(public auth: AuthService, private messagesProvider: MessagesProvider) {

    }

    send() {
        this.messagesProvider.create(this.candidate, this.message).subscribe(
            m => {
                this.messages.push(m);
                this.refresh();
            },
            e => this.errorMessage = e
        )
    }

    refresh() {
        this.messages = this.messages.slice();
        this.message = '';
    }
}