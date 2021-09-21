import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInput, MatChipInputEvent } from '@angular/material/chips';
import { ActivatedRoute, Params, Router } from '@angular/router';


const FORM_TYPES = {
  CUSTOM_SECTION: 'CustomSection',
  CHIP_SECTION: 'ChipSection',
  BULLET_LIST_SECTION: 'BULLET_LIST_SECTION',
  INTEREST_SECTION: 'InterestSection'
};


import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { debounceTime } from 'rxjs/operators';
import { AppSession } from 'src/shared/app.session';
import { ResumeService } from 'src/shared/services/resume.service';

export interface Fruit {
  name: string;
}



@Component({
  selector: 'app-create-template',
  templateUrl: './create-template.component.html',
  styleUrls: ['./create-template.component.css']
})
export class CreateTemplateComponent implements OnInit {

  public loading: boolean = true;

  public progessLoading = false;
  public pdfLoading = false;
  public isProgressSaved = false;


  public resumeForm: FormGroup;
  private resumeId: string | undefined;
  private userResumeId: string | undefined;

  public rules: any;

  public formType = FORM_TYPES;

  public fixedRules: {} = {};

  readonly separatorKeysCodes = [ENTER, COMMA] as const;


  @ViewChild('pdfView') public pdfView: ElementRef | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private activatedRoute: ActivatedRoute, 
    private resumeService: ResumeService, private router: Router) {
    this.resumeForm = this.fb.group({
      columns: this.fb.array([])
    });
  }

  ngOnInit(): void {
    // setInterval(() => console.log(this.resumeForm.value), 5000);

    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if(params['resumeId']){
        this.resumeId = params['resumeId'];

        this.resumeService.getById(this.resumeId as string).subscribe((data) => {
           const { rules } = data;
           this.rules = rules;

           this.setFormBody(rules);  
        });
        return;
      }
      else if(params['userResumeId']){
        this.userResumeId = params['userResumeId'];
        // after routing subscription we make http request.
        this.resumeService.getUserResumeById(this.userResumeId as string).subscribe((data: any) => {
          //@ts-ignore
          const {BodyJson: body} = data;
          const rules = data?.Resume?.rules;
          this.resumeId = data?.resumeId;
          this.rules = rules;
          
          this.setFormBody(rules, body);
          // this.resumeForm.setValue(body)
        });
      }
    });

    this.resumeForm.valueChanges.subscribe(() =>{
      this.loading = true;
    });

    this.resumeForm.valueChanges.pipe(debounceTime(2000)).subscribe(() => {
      // console.log(this.resumeForm.value);

      if(this.resumeForm.invalid) {
        console.log('form is wrong');
        return;
      }
      const body = this.resumeForm.value;

      // this.resumeService.saveResumeHtml(this.resumeId as string, body).subscribe((result: any) => {
      //   this.userResumeId = result.id;
      // });

      this.resumeService.getResumeLayout(this.resumeId as string, body).subscribe((result) => {
          this.loading = false;
          let doc =  this.pdfView?.nativeElement.contentDocument || this.pdfView?.nativeElement.contentWindow;
          doc.open();
          doc.write(result);
          doc.close();
      }, (err) => {
        console.error(err);
      });
    });
  }

  get _userResumeId() {
    return this.userResumeId;
  }

  setFormBody(rule: any, body: any = null){

    const {body: ruleBody, columns} = rule;

    console.log(body);

    for(let rule in ruleBody){
      let control: FormControl | FormArray;
      if(ruleBody[rule]?.type === 'string') {
        control = new FormControl('', []);
      } else if (ruleBody[rule]?.type === 'number') {
        control = new FormControl(0, []);
      } else if(Array.isArray(ruleBody[rule]?.type)) {
        control = new FormArray([]);
      }

      if(control!){
        if(body && body[rule]){
          if(typeof body[rule] === 'string' || typeof body[rule] === 'number' || typeof body[rule] === 'boolean') control.setValue( body[rule] );
          else if (rule === 'skills' || rule === 'languages'){
            for(let item of body[rule]){
              (control as FormArray).push(new FormGroup({
                name: new FormControl(item.name)
              }));
            }
          }
        }
        this.resumeForm.addControl( rule, control );
      }
    }

    this.resumeForm.addControl('columns', new FormArray([]));
    Array.from({length: columns}, () => null).forEach( () => (this.resumeForm.get('columns') as FormArray).push(new FormArray([])) );

    if(body){
      for(let i = 0; i < body['columns'].length; i++){
        let column = body['columns'][i];
        for(let item of column){
          if(item.type === FORM_TYPES.CUSTOM_SECTION){
            // const section = this.getCustomItem(FORM_TYPES.CUSTOM_SECTION);
            // (section.get('title') as FormControl).setValue(item.title);
            const section = this.setCustomItem(item);
            
            // const formArray = new FormArray([]);
            // formArray.push( section );
            ((this.resumeForm.get('columns') as FormArray).at(i) as FormArray).push(section); 
            // const array = (this.resumeForm.get('columns') as FormArray)
            // .at(i) as FormArray).push(section);
          } else if (item.type === FORM_TYPES.INTEREST_SECTION || item.type === FORM_TYPES.CHIP_SECTION){
            const formArray = new FormArray([]);
            for(let i = 0; i < item.chips.length; i++){
              let chip = item.chips[i];
              let group = new FormGroup({
                name: new FormControl(chip.name)
              });
              formArray.push(group);
              // group.setValue({ name: chip.name });
              // console.log('form array', item.chips);
            }
            ((this.resumeForm.get('columns') as FormArray).at(i) as FormArray).push(new FormGroup({
              type: new FormControl(item.type),
              chips: formArray,
              title: new FormControl(item.title)
            })); 
          }
        }
      }
    }
    

    console.log(this.resumeForm.value);
    // console.log(body && body['columns']);

  }

  addChip(chip: FormArray, event: MatChipInputEvent){
    const value = (event.value || '').trim();

    if (value) {
      chip.push( this.fb.group({name: value}) );
      this.resumeForm.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();

  }


  getCustomItem(type: string = FORM_TYPES.CUSTOM_SECTION){
    return this.fb.group({
      type: type,
      title: '',
      section: this.fb.array([ this.getCustomSection(type) ])
    });
  }

  setCustomItem(object: any){
    const formArray = new FormArray([]);
    for(let i = 0; i < object.section.length; i++){
      const section = this.getCustomSection(FORM_TYPES.CUSTOM_SECTION);
      const sectionItem = object.section[i];
      let n = sectionItem.list.length - (section.get('list') as FormArray).length;
      for (let i = 0; i < n; i++ ){
        (section.get('list') as FormArray).push(this.getListItem());
      }
      
      section.setValue(sectionItem);
      formArray.push(section)
    }

    console.log(formArray);

    return this.fb.group({
      type: FORM_TYPES.CUSTOM_SECTION,
      title: object?.title,
      section: formArray
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

  getChipItem(title: string, controlName: string){
    let group = this.fb.group({
      title: title
    });

    group.addControl(controlName, new FormArray([]));

    return group;
  }
  
  customFormControl(key: string | string[], value: string | string[]){
    let group = this.fb.group({});
    if(Array.isArray(key) && Array.isArray(value)){
      for(let i = 0; i < key.length; i++){
        group.addControl(key[i], new FormControl(value[i]));
      }
    }else if( typeof key === "string" ) {
      group.addControl(key, new FormControl(value));
    }
    return group;
  }

  getCustomSection(type: string = FORM_TYPES.CUSTOM_SECTION) : FormGroup{
    let group = this.fb.group({
      title: 'Untitled',
      subtitle: '',
      date: this.fb.group({
        from: '',
        to: ''
      }),
      location: '',
      smallText: this.fb.array([]),
      list: this.fb.array([this.getListItem()])
    });

    if(type === FORM_TYPES.BULLET_LIST_SECTION){
      // console.log('bullet list section is added');
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

  getAsFormArray(ab: AbstractControl | undefined | null){
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

  isRuleAvailable(rule: string): boolean{
    const layout = this.rules?.body?.layout;
    return Object.keys(layout).includes(rule);   
  }


  addColumnItem(event: Event, type: string = FORM_TYPES.CUSTOM_SECTION, index:number = 0, title:string | null = null): void{
    event?.preventDefault();

    const column = (this.resumeForm.get('columns') as FormArray).at(index) as FormArray;

    if(type === FORM_TYPES.CHIP_SECTION || type === FORM_TYPES.INTEREST_SECTION){
      if(title){
        let formGroup = this.getChipItem(title, "chips");
        if(type === FORM_TYPES.CHIP_SECTION)
          formGroup.addControl('type', new FormControl(FORM_TYPES.CHIP_SECTION));
        else if (type === FORM_TYPES.INTEREST_SECTION)
          formGroup.addControl('type', new FormControl(FORM_TYPES.INTEREST_SECTION));

        column.push(formGroup)
        this.resumeForm.markAsDirty();
      }
      return;
    }

    
    if(type === FORM_TYPES.BULLET_LIST_SECTION){
      column.push(this.getCustomItem(FORM_TYPES.BULLET_LIST_SECTION));
      return;
    }

    if(type === FORM_TYPES.CUSTOM_SECTION){
      let formGroup = this.getCustomItem(FORM_TYPES.CUSTOM_SECTION)
      if(title) {
        (formGroup.get('title') as FormControl).setValue(title);
      }
      column.push(formGroup);
      this.resumeForm.markAsDirty();
      return;
    }


  }

  addSecitonItem(item: any, event: Event, type: string = 'CUSTOM_SECTION'): void{
    event.preventDefault();
    (item.get('section') as FormArray).push(this.getCustomSection());
    this.resumeForm.markAsDirty();
  }

  addSectionList(section: any, event: Event): void {
    event.preventDefault();
    (section.get('list') as FormArray).push(this.getListItem());
    this.resumeForm.markAsDirty();
  }

  addSectionBulletList(section: any, event: Event): void {
    event.preventDefault();
    (section.get('bulletList') as FormArray).push(this.fb.group({
      name: ''
    }));
    this.resumeForm.markAsDirty();
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
      this.isProgressSaved = true;
      this.progessLoading = true;
      const body = this.resumeForm.value;


      if(this.userResumeId){
        // console.log(body);
        this.resumeService.updateResumeHtml(this.userResumeId, body).subscribe(result => {
          this.progessLoading = false;
          this.resumeForm.markAsPristine();
          console.log('resume has been updated');
        });

        return;
      }


      this.resumeService.saveResumeHtml(this.resumeId as string, body).subscribe((result: any) => {
        this.progessLoading = false;
        this.resumeForm.markAsPristine();
        console.log('resume has been created');
        this.userResumeId = result.id;
      });
      return;
    }

    if(attribute === 'generate-pdf'){
      this.isProgressSaved = false;
      this.pdfLoading = true;
      if(!this.userResumeId) return console.log('user resume id does not exist');

      const body = this.resumeForm.value;

      this.resumeService.saveResumePdf(this.userResumeId).subscribe((result) => {
        this.pdfLoading = false;
        this.resumeService.getPdf(this.userResumeId as string).subscribe(blobResult => {
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

  isFormDirty(): boolean {
    return this.resumeForm.dirty;
  }

  exit(){
    this.router.navigate(['/template']);
  }

  add(chips: FormArray, event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      chips.push(
        this.fb.group({
          name: value
        })
      );
      this.resumeForm.markAsDirty();
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(chips: AbstractControl | null, x: number): void {
    (chips as FormArray).removeAt(x);
  }

}
