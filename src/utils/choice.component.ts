import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../providers/task';
import _ from 'lodash';

@Component({
    selector: 'workflow_choice',
    templateUrl: 'choice.html',
    providers: []
})
export class WorkFlowChoice implements OnInit {
    @Input() task: Task;
    @Output() nextQuestion = new EventEmitter<Number>();

    private question: String;
    private answers: {
        label: String,
        next_id: Number
    }[];
    private selectNext: Number;

    constructor() {

    }

    public next() {
        this.nextQuestion.emit(this.selectNext);
    }

    public setNextId(next: Number) {
        this.selectNext = next;
    }

    ngOnInit(): void {
        let json_content = JSON.parse(this.task.content);
        this.answers = new Array();

        this.question = json_content.question;
        _.each(json_content.answers, answer => {
            this.answers.push({ label: answer.label, next_id: answer.next_id })
        });
    }
}
