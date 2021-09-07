import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {

    const headers = new HttpHeaders({
      'auth-token': 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZDhiYzRjLTQ3MjktNDJkNy1iZWU2LTJjNjA5YWQ0MTU3ZiIsImVtYWlsIjoiZmExNmJzY3MwMDE1QG1hanUuZWR1LnBrIiwiaWF0IjoxNjI5NzAzMzM5LCJleHAiOjE2Mjk3NDY1Mzl9.VYGJy-9YBvK92mnbj9cPZg474C4CR9Hw9syFTVbkzjw'
    });


    this.http.get<any>('http://localhost:3000' + '/api/v1/resume/get-all-userresumes', {
      headers
    })
    .subscribe(
      (result) => {
        this.templates = result.map((x: any) => {
          x.description = 'this is one of the description';
          return x;
        });

        // this.templates.map(x => x.description = 'this is one of the desc');
        console.log(result)
      },
      (err) => {
        console.error(err);
      }
    );
  }


  itemSelected(item: any){
    this.router.navigate( ['/template/create'], {
      queryParams: {
        userResumeId: item.id
      }
    });
  }

}
