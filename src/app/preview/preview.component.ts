import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ResumeService } from 'src/shared/services/resume.service';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {

  public templates: {
    id: string,
    imagePath: string,
    fileName: string,
    description: string
  }[] = [];

  constructor(private http: HttpClient, private router: Router, private resumeService: ResumeService) { }

  ngOnInit(): void {

    
    this.resumeService.getAllUserResume().subscribe((result: []) => {
        this.templates = result.map((x: any) => {
          x.description = 'this is one of the description';
          return x;
        });

        // this.templates.map(x => x.description = 'this is one of the desc');
        console.log(result)
      },
      (err) => {
        console.error(err);
      });
  }


  itemSelected(item: any){
    this.router.navigate( ['/template/create'], {
      queryParams: {
        userResumeId: item.id
      }
    });
  }

}
