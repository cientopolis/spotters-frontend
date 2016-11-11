import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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

    private question: string;
    private next_id: number;

    constructor() {

    }

    public next(value) {
        this.nextQuestion.emit({ next: this.next_id, value: value });
    }

    public updateTask() {
        let json_content = JSON.parse(this.task.content);
        this.question = json_content.question;
        this.next_id = json_content.next_id
    }

    public isFinalQuestion(): boolean {
        return _.isUndefined(this.next_id);
    }

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnChanges() {
        this.updateTask();
    }
}