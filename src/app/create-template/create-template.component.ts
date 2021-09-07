import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params } from '@angular/router';


const FORM_TYPES = {
  CUSTOM_SECTION: 'CUSTOM_SECTION',
  SKILLS: 'SKILLS',
  BULLET_LIST_SECTION: 'BULLET_LIST_SECTION' 
};


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { debounceTime } from 'rxjs/operators';

export interface Fruit {
  name: string;
}



@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {


  public resumeForm: FormGroup;
  private resumeId: string | undefined;
  private userResumeId: string | undefined;

  public formType = FORM_TYPES;

  @ViewChild('pdfView') public pdfView: ElementRef | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.resumeForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.resumeForm = this.fb.group({
      titleName: '',
      email: '',
      titleDescription: '',
      residence: '',
      linkedinUrl: '',
      number: '',
      columns: this.fb.array([ 
        this.fb.array([]),
        this.fb.array([])
      ])
    });

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['resumeId'])
        this.resumeId = params['resumeId'];
      if(params['userResumeId']){
        this.userResumeId = params['userResumeId'];
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'auth-token': 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZDhiYzRjLTQ3MjktNDJkNy1iZWU2LTJjNjA5YWQ0MTU3ZiIsImVtYWlsIjoiZmExNmJzY3MwMDE1QG1hanUuZWR1LnBrIiwiaWF0IjoxNjI5NzAzMzM5LCJleHAiOjE2Mjk3NDY1Mzl9.VYGJy-9YBvK92mnbj9cPZg474C4CR9Hw9syFTVbkzjw'
        });

        // after routing subscription we make http request.
        this.http.request('get', 'http://localhost:3000' + '/api/v1/resume/get-userresume-id', {
          headers: headers,
          params: new HttpParams( { fromString: `id=${this.userResumeId}` } ),
        }).subscribe( (data) => {
          //@ts-ignore
          const {BodyJson: body} = data;

          body['columns'].splice(0, 2);
          console.log(body);
          this.resumeForm.setValue(body); 

        });
      }
    });

    this.resumeForm.valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      console.log('The debounce time kicks in place');

      if(this.resumeForm.invalid) {
        console.log('form is wrong');
        return;
      }
  
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'auth-token': 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZDhiYzRjLTQ3MjktNDJkNy1iZWU2LTJjNjA5YWQ0MTU3ZiIsImVtYWlsIjoiZmExNmJzY3MwMDE1QG1hanUuZWR1LnBrIiwiaWF0IjoxNjI5NzAzMzM5LCJleHAiOjE2Mjk3NDY1Mzl9.VYGJy-9YBvK92mnbj9cPZg474C4CR9Hw9syFTVbkzjw'
      });
  
  
      const body = this.resumeForm.value;
    
      // console.log(body);

  
      this.http.request('post', 'http://localhost:3000' + '/api/v1/resume/get-resume-layout', {
        body: body,
        headers: headers,
        params: new HttpParams( { fromString: `id=${this.resumeId}` } ),
        responseType: 'text'
      }).subscribe((result) => {
          let doc =  this.pdfView?.nativeElement.contentDocument || this.pdfView?.nativeElement.contentWindow;
          doc.open();
          doc.write(result);
          doc.close();
      }, (err) => {
        console.error(err);
      });
    });
  }

  addChip(chip: FormArray, event: MatChipInputEvent){
    const value = (event.value || '').trim();

    if (value) {
      chip.push( this.fb.group({name: value}) );
    }

    // Clear the input value
    event.chipInput!.clear();

  }


  getCustomItem(type: string = FORM_TYPES.CUSTOM_SECTION){
    return this.fb.group({
      title: 'Untitled',
      section: this.fb.array([ this.getCustomSection(type) ])
    });
  }

  getSkillsItem(): FormGroup {
    return this.fb.group({
      title: 'SKILLS',
      chips: this.fb.array([
        // this.fb.group({
        //   name: 'Mansoor'
        // })
      ]),
    });
  }

  getCustomSection(type: string = FORM_TYPES.CUSTOM_SECTION) : FormGroup{
    let group = this.fb.group({
      title: 'Software Development',
      subtitle: 'AKSIQ',
      date: this.fb.group({
        from: [''],
        to: ['']
      }),
      location: 'Karachi, Pakistan',
      smallText: this.fb.array([]),
      // list: this.fb.array([this.getListItem()])
    });

    if(type === FORM_TYPES.BULLET_LIST_SECTION){
      console.log('bullet list section is added');
      group.addControl('bulletList', this.fb.array([
        this.fb.group({
          name: ''
        }) 
      ]));
      return group;
    }

    if(type === FORM_TYPES.CUSTOM_SECTION){
      group.addControl('list', this.fb.array([this.getListItem()]));
      return group;  
    }

    return group;
  }

  getListItem(): FormGroup {
    return this.fb.group({
      heading: '',
      paragraph: ''
    });
  }

  getAsFormArray(ab: AbstractControl){
    return (ab as FormArray);
  }

  getAsFormGroup(ab: AbstractControl, key: string){
    return ab.get(key) as FormGroup;
  }


  get _getColumns(): FormArray {
    return this.resumeForm.get('columns') as FormArray;
  }

  get _getColumnSections(): FormArray {
    let columns = this.resumeForm.get('columns') as FormArray;
    let column = columns.at(0) as FormArray;
    return column;
  }


  addColumnItem(event: Event, type: string = FORM_TYPES.CUSTOM_SECTION, index:number = 0): void{
    event.preventDefault();

    const column = (this.resumeForm.get('columns') as FormArray).at(index) as FormArray;

    if(type === FORM_TYPES.SKILLS){
      column.push(this.getSkillsItem())
      return;
    }

    
    if(type === FORM_TYPES.BULLET_LIST_SECTION){
      column.push(this.getCustomItem(FORM_TYPES.BULLET_LIST_SECTION));
      return;
    }

    if(type === FORM_TYPES.CUSTOM_SECTION){
      column.push(this.getCustomItem(FORM_TYPES.CUSTOM_SECTION));
      return;
    }


  }

  addSecitonItem(item: any, event: Event, type: string = 'CUSTOM_SECTION'): void{
    event.preventDefault();
    (item.get('section') as FormArray).push(this.getCustomSection());    
  }

  addSectionList(section: any, event: Event): void {
    event.preventDefault();
    (section.get('list') as FormArray).push(this.getListItem()); 
  }

  addSectionBulletList(section: any, event: Event): void {
    event.preventDefault();
    (section.get('bulletList') as FormArray).push(this.fb.group({
      name: ''
    })); 
  }

  removeSectionList(list: AbstractControl, index: number){
    (list as FormArray).removeAt(index);
  }

  removeSection(column: AbstractControl, index: number){
    (column as FormArray).removeAt(index);
  }

  removeSectionItem(item: AbstractControl, index: number){
    const sections = item.get('section') as FormArray;
    sections.removeAt(index);
  }


  formSubmit(event: Event) {

    const attribute = document.activeElement?.getAttribute("name");

    if(attribute === 'save-progress'){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'auth-token': 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZDhiYzRjLTQ3MjktNDJkNy1iZWU2LTJjNjA5YWQ0MTU3ZiIsImVtYWlsIjoiZmExNmJzY3MwMDE1QG1hanUuZWR1LnBrIiwiaWF0IjoxNjI5NzAzMzM5LCJleHAiOjE2Mjk3NDY1Mzl9.VYGJy-9YBvK92mnbj9cPZg474C4CR9Hw9syFTVbkzjw'
      });

      const body = this.resumeForm.value;

      if(this.userResumeId){
        debugger;
        this.http.request('put', 'http://localhost:3000' + '/api/v1/resume/update-resume-html', {
          body: body,
          headers: headers,
          params: new HttpParams( { fromString: `id=${this.userResumeId}` } )
        }).subscribe((result) => {
          console.log('the cv has been sucessfull updated');
          console.log(result);
        });

        return;
      }


      this.http.request('post', 'http://localhost:3000' + '/api/v1/resume/save-resume-html', {
        body: body,
        headers: headers,
        params: new HttpParams( { fromString: `id=${this.resumeId}` } )
      }).subscribe((result) => {
        //@ts-ignore
        // result.id is the userresumeId.
        this.userResumeId = result.id;
        console.log(result);
      });
      return;
    }

    if(attribute === 'generate-pdf'){
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'auth-token': 'bearer ' + 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImE4ZDhiYzRjLTQ3MjktNDJkNy1iZWU2LTJjNjA5YWQ0MTU3ZiIsImVtYWlsIjoiZmExNmJzY3MwMDE1QG1hanUuZWR1LnBrIiwiaWF0IjoxNjI5NzAzMzM5LCJleHAiOjE2Mjk3NDY1Mzl9.VYGJy-9YBvK92mnbj9cPZg474C4CR9Hw9syFTVbkzjw'
      });

      if(!this.userResumeId) return console.log('user resume id does not exist');

      const body = this.resumeForm.value;


      this.http.request('post', 'http://localhost:3000' + '/api/v1/resume/save-resume-pdf', {
        headers: headers,
        params: new HttpParams( { fromString: `id=${this.userResumeId}` } )
      }).subscribe((result) => {
        this.http.request('get', 'http://localhost:3000' + '/api/v1/resume/get-pdf', {
          headers: headers,
          params: new HttpParams( { fromString: `id=${this.userResumeId}` } ),
          responseType: 'blob'
        }).subscribe(blobResult => {
          const anchorTag = document.createElement('a');
          const filePath = URL.createObjectURL(blobResult)
          anchorTag.href = filePath;
          anchorTag.download = filePath.substr(filePath.lastIndexOf('/') + 1);
          anchorTag.click();
        });
      });
      return;
    }
  }


  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  add(chips: FormArray, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      chips.push(
        this.fb.group({
          name: value
        })
      );
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(chips: AbstractControl | null, x: number): void {
    (chips as FormArray).removeAt(x);
  }

}
