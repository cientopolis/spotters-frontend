import { findIndex } from 'rxjs/operator/findIndex';
import { updateDate } from 'ionic-angular/es2015/util/datetime-util';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

    private question: String;
    private answers: {
        label: String
    }[];
    private next_id: Number;
    private values = [];

    constructor() {
        this.values = new Array();
    }

    public next() {
        this.nextQuestion.emit({ next: this.next_id, value: this.values });
    }

    public updateTask() {
        let json_content = JSON.parse(this.task.content);
        this.answers = new Array();

        this.question = json_content.question;
        _.each(json_content.answers, answer => {
            this.answers.push({ label: answer.label })
        });
        this.next_id = json_content.next_id
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

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnChanges() {
        this.updateTask();
    }
}
