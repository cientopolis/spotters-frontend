import { updateDate } from 'ionic-angular/es2015/util/datetime-util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

    private question: string;
    private answers: {
        label: string,
        next_id: number
    }[];
    private selectNext: number;
    private value: string;

    constructor() {

    }

    public next() {
        this.nextQuestion.emit({next: this.selectNext, value: this.value});
    }

    public setNextId(next: number, selectedValue: string) {
        this.selectNext = next;
        this.value = selectedValue;
    }

    public updateTask() {
        let json_content = JSON.parse(this.task.content);
        this.answers = new Array();

        this.question = json_content.question;
        _.each(json_content.answers, answer => {
            this.answers.push({ label: answer.label, next_id: answer.next_id })
        });
    }

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnChanges() {
        this.updateTask();
    }
}
