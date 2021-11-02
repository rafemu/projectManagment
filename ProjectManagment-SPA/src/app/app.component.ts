import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { setProjectsLS } from './components/timesheet/projects.localStorage';
import { AuthService } from './_services/auth.service';
import { ProjectsService } from './_services/projects.service';
import { TokenService } from './_services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  private subProject!:Subscription;
  constructor(private projectsService:ProjectsService,private _tokenService:TokenService){
  
  }
  
  ngOnInit(): void {
    const token = this._tokenService.getToken();
    if (token) {
      this.projectsService.getAllProjects()
      this.subProject= this.projectsService.projects$
    .pipe(filter((v) => v !== undefined))
    .subscribe((projec) => {
        setProjectsLS(projec.projects)
    });

    }
    
    
  }
}
