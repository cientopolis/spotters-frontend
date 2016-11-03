import { Component, OnInit, Input } from '@angular/core';
import { Task } from '../providers/task';

@Component({
    selector: 'workflow_input',
    template: '<input type="text" value="probando un input" />',
    providers: []
})
export class WorkFlowInput implements OnInit {
    @Input() task: Task;

    constructor() {

    }

    ngOnInit(): void {
        console.log(this.task);
        console.log(this.task.content);
        console.log(this.task.content.question);
    }
}
