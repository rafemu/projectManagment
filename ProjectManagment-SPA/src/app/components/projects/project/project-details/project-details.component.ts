import { Component, Input, OnInit } from '@angular/core';
import { IProject } from 'src/app/_interfaces/project.interface';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
@Input() project!:IProject
  constructor() { }

  ngOnInit(): void {
  }

}
