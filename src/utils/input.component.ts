import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Task } from '../models/task';
import _ from 'lodash';

@Component({
    selector: 'workflow_input',
    templateUrl: 'input.html',
    providers: []
})
export class WorkFlowInput implements OnInit {
    @Input() task: Task;
    @Output() nextQuestion = new EventEmitter();

    question: string;
    next_id: number;

    constructor() {

    }

    public next(value) {
        this.nextQuestion.emit({ next: this.next_id, value: value });
    }

    public updateTask() {
        this.question = this.task.content.question;
        this.next_id = this.task.content.next_id
    }

    public isFinalQuestion(): boolean {
        return _.isUndefined(this.next_id);
    }

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.updateTask();
    }
}