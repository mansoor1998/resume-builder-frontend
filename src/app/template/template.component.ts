import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { catchError } from 'rxjs/operators';
import { ResumeService } from 'src/shared/services/resume.service';


@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {

  public templates: {
    id: string,
    imagePath: string,
    fileName: string,
    description: string,
    htmlFile: string,
    resumeImagePath: string
  }[] = [];

  constructor(private http: HttpClient, private router: Router, private resumeService: ResumeService) { }

  ngOnInit(): void {


    
    this.resumeService.getAllResume().subscribe((result: []) => {
        this.templates = result.map((x: any) => {
          x.description = 'this is one of the description';
          return x;
        });

        console.log(result)
      },
      (err) => {
        console.error(err);
      });
  }

  itemSelected(item: any){
    this.router.navigate( ['/template/create'], {
      queryParams: {
        resumeId: item.id || item.resumeId
      }
    });
  }

}
