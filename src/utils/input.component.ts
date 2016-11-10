import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Task } from '../providers/task';

@Component({
    selector: 'workflow_input',
    templateUrl: 'input.html',
    providers: []
})
export class WorkFlowInput implements OnInit {
    @Input() task: Task;
    @Output() nextQuestion = new EventEmitter<Number>();

    private question: String;
    private next_id: Number;

    constructor() {

    }

    public next() {
        this.nextQuestion.emit(this.next_id);
    }

    public updateTask() {
        let json_content = JSON.parse(this.task.content);
        this.question = json_content.question;
        this.next_id = json_content.next_id
    }

    ngOnInit(): void {
        this.updateTask();
    }

    ngOnChanges() {
        this.updateTask();
    }
}