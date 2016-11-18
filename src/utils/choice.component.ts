import { Component, OnInit, Input, Output, EventEmitter, SimpleChange } from '@angular/core';
import { Task } from '../models/task';
import _ from 'lodash';

@Component({
    selector: 'workflow_choice',
    templateUrl: 'choice.html',
    providers: []
})
export class WorkFlowChoice implements OnInit {
    @Input() task: Task;
    @Output() nextQuestion = new EventEmitter();

    question: string;
    answers: {
        label: string,
        next_id: number
    }[];
    selectNext: number;
    value: string;

    constructor() { }

    hasValue(): boolean {
        return !_.isNil(this.value);
    }

    public next() {
        if (this.hasValue()) {
            this.nextQuestion.emit({ next: this.selectNext, value: this.value });
        }
    }

    public setNextId(next: number, selectedValue: string) {
        this.selectNext = next;
        this.value = selectedValue;
    }

    public updateTask() {
        this.answers = [];

        this.question = this.task.content.question;
        _.each(this.task.content.answers, answer => {
            this.answers.push({ label: answer.label, next_id: answer.next_id })
        });
    }

    //TODO: En funcion de que choice elije, podria ser o no la pregunta final, es necesario corroborar en todo momento este value

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
        this.updateTask();
    }
}
