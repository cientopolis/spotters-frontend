import { Component, Input } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { ClassificationVotesProvider } from '../../providers/classificationVotes.provider';
import { MessagesProvider } from '../../providers/messages.provider';
import { MessageVotesProvider } from '../../providers/messageVotes.provider';
import { Candidate } from '../../models/candidate';
import { Classification } from '../../models/classification';
import { Message } from '../../models/message';
import { Workflow } from '../../models/workflow';
import { Task } from '../../models/task';
import { constants } from '../../app/app.constants';
import _ from 'lodash';

@Component({
  selector: 'candidate-card',
  templateUrl: 'candidate-card.html'
})
export class CandidateCardComponent {
  @Input() candidate: Candidate;
  @Input() workflow: Workflow;
  displayMessages: boolean = false;
  errorMessage: string = '';

  constructor(private auth: AuthService, private classificationVotesProvider: ClassificationVotesProvider, private messagesProvider: MessagesProvider, private messageVotesProvider: MessageVotesProvider) {

  }

  getUrl(candidate: Candidate): string {
    return `https://maps.googleapis.com/maps/api/streetview?size=640x480&location=${candidate.lat},${candidate.lng}&heading=${candidate.heading}&pitch=${candidate.pitch}&fov=120&key=${constants.googleKey}`;
  }

  getTask(question: number): Task {
    return JSON.parse(_.find(this.workflow.tasks, { "id": question }).content);
  }

  toggleMessages(candidate: Candidate) {
    this.displayMessages = !this.displayMessages;
  }

  sendMessage(message: string) {
    this.messagesProvider.create(this.candidate, message).subscribe(
      m => this.candidate.messages.push(m),
      e => this.errorMessage = e
    )
  }

  classificationVote(classification: Classification, vote: boolean) {
    this.classificationVotesProvider.create(this.candidate, classification, vote).subscribe(
      v => classification.votes.push(v),
      e => this.errorMessage = e
    )
  }

  messageVote(message: Message, vote: boolean) {
    this.messageVotesProvider.create(this.candidate, message, vote).subscribe(
      v => message.votes.push(v),
      e => this.errorMessage = e
    )
  }
}
