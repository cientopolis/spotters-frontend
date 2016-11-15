import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { MessageVotesProvider } from '../../providers/messageVotes.provider';
import { Candidate } from '../../models/candidate';
import { Message } from '../../models/message';
import _ from 'lodash';

@Component({
    selector: 'message-item',
    templateUrl: 'message-item.html'
})
export class MessageItemComponent implements OnInit {
    @Input() candidate: Candidate = null;
    @Input() message: Message = null;
    positiveVotes: number = 0;
    negativeVotes: number = 0;
    userVoted: boolean = false;
    errorMessage: string = '';

    constructor(public auth: AuthService, private messageVotesProvider: MessageVotesProvider) {

    }

    vote(vote: boolean) {
        this.messageVotesProvider.create(this.candidate, this.message, vote).subscribe(
            v => {
                this.message.votes.push(v);
                this.calculateVotes();
            },
            e => this.errorMessage = e
        )
    }

    calculateVotes() {
        this.positiveVotes = _.filter(this.message.votes, { 'positive': true }).length;
        this.negativeVotes = this.message.votes.length - this.positiveVotes;
        this.userVoted = this.auth.authenticated() && !_.isUndefined(_.find(this.message.votes, v => {
            return v.user.sub === (this.auth.user as any).user_id; // Corregir este hack
        }));
    }

    ngOnInit(): void {
        this.calculateVotes();
    }
}