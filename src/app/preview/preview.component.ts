import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { fadeInAnimation } from 'src/shared/animations/routerTransition';
import { ResumeService } from 'src/shared/services/resume.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css'],
  animations: [
    fadeInAnimation
  ]
})
export class PreviewComponent implements OnInit {

  public templates: {
    id: string,
    imagePath: string,
    fileName: string,
    description: string,
    htmlFile: string,
    userResumeImagePath: string,
    resumeImagePath: string,
  }[] = [];

  public imagePath: string[] = [];

  constructor(private http: HttpClient, private router: Router, 
    private resumeService: ResumeService) { }

  ngOnInit(): void {

    
    this.resumeService.getAllUserResume().subscribe((result: any[]) => {
        console.log(result);
        this.templates = result.map((x: any) => {
          x.description = 'this is one of the descroption';
          return x;
        });

        for(let i = 0; i < this.templates.length; i++){
          const htmlFile = this.templates[i].userResumeImagePath;
          this.getResumeImage(htmlFile).subscribe((blob) => {
            const filePath = URL.createObjectURL(blob);
            this.templates[i].resumeImagePath = filePath;
          }, (err: HttpErrorResponse) => {
            console.log('log error status');
            if(err.status === 404){
              // console.log(this.templates[i].htmlFile);
              // this.templates[i].resumeImage = this.templates[i].imagePath;
            }
          })
        }
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

  downloadFile(item: any){
    this.resumeService.getPdf(item.id).subscribe( (blobResult) => {
      const anchorTag = document.createElement('a');
      const filePath = URL.createObjectURL(blobResult)
      anchorTag.href = filePath;
      anchorTag.download = filePath.substr(filePath.lastIndexOf('/') + 1);
      anchorTag.click();
    }, (err: HttpErrorResponse) => {
      if(err.status === 404) {
        console.log('404 status error this');
        Swal.fire({
          title: 'Pdf version does not exist',
          text: 'Generate Pdf version of this resume',
          toast: true,
          icon: 'error',
          position: 'bottom-right',
          showConfirmButton: false
        })
        // this.toastr.error('Generate Pdf version of this resume', 'Pdf version does not exist');
      }
    });
  }

  deleteResume(item: any){
    console.log(item);
    this.resumeService.deleteUserResume(item.id).subscribe(() => {
      this.templates = this.templates.filter(x => x.id !== item.id);
    })
  }

  getResumeImage(imagePath: string){
    return this.resumeService.getUserResumeImage(imagePath);
  }

}
