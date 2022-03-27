import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { ResumeService } from 'src/shared/services/resume.service';

@Component({
  selector: 'app-create-template-new',
  templateUrl: './create-template-new.component.html',
  styleUrls: ['./create-template-new.component.css']
})
export class CreateTemplateNewComponent implements OnInit {

  public resumeForm: FormGroup;
  private resumeId: string | undefined;
  private userResumeId: string | undefined;
  private rules: {} = {};

  public fixedForm: any = {
    'skills': {
      'name': () => new FormControl('', Validators.required)
    },
    'languages': {
      'name': () => new FormControl('', Validators.required)
    }
  };

  public email = 'email';

  constructor(private fb: FormBuilder, private http: HttpClient, private activatedRoute: ActivatedRoute, private resumeService: ResumeService) {
    this.resumeForm = this.fb.group({});
  }

  ngOnInit(): void {

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['resumeId']) this.resumeId = params['resumeId'];
      else if(params['userResumeId']) this.userResumeId = params['userResumeId'];
      
      if(this.resumeId){
        this.resumeService.getById(this.resumeId).subscribe(resume => {
          this.rules = resume.rules.body;
          // console.log(this.rules);
          for(let key in this.rules){
            if(key === 'layout') continue;

            //@ts-ignore
            if(Array.isArray(this.rules[key].type)){

              const formArray = new FormArray([]);
              this.resumeForm.addControl(key, formArray);
              continue;
            }

            // this.fixedForm[key] = {
            //   //@ts-ignore
            //   form : this.rules[key],
            //   control: new FormControl('', Validators.required)
            // }
            //@ts-ignore
            this.fixedForm[key] = this.rules[key];
            this.resumeForm.addControl(key, new FormControl('', Validators.required));
          }

          console.log( this.fixedForm );

        });
      }
      // this.resumeService.getUserResumeById(this.userResumeId);
    });
  }

  submit(){
    console.log( this.resumeForm.value );
  }

}
