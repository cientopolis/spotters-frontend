import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Task } from '../models/task';
import _ from 'lodash';

@Component({
    selector: 'workflow_radio',
    templateUrl: 'radio.html',
    providers: []
})
export class WorkFlowRadio implements OnInit {
    @Input() task: Task;
    @Output() nextQuestion = new EventEmitter();

    question: String;
    answers: {
        label: String
    }[];
    next_id: Number;
    values = [];

    constructor() {
        this.values = new Array();
    }

    public next() {
        this.nextQuestion.emit({ next: this.next_id, value: this.values });
    }

    public updateTask() {
        this.answers = [];

        this.question = this.task.content.question;
        _.each(this.task.content.answers, answer => {
            this.answers.push({ label: answer.label })
        });
        this.next_id = this.task.content.next_id
    }

    public toggleValue(value: string): void {
        let index = _.findIndex(this.values, (val) => {
            return val == value
        });
        if (index == -1) {
            this.values.push(value);
        }
        else {
            this.values.splice(index, 1);
        }
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
