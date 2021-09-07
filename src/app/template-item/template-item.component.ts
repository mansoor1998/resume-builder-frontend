import { Component, Input, OnInit, Output } from '@angular/core';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-template-item',
  templateUrl: './template-item.component.html',
  styleUrls: ['./template-item.component.css']
})
export class TemplateItemComponent implements OnInit {

  // this is template item
  @Input('templateItem') public item: {
    id: string,
    imagePath: string,
    fileName: string,
    description: string
  } | undefined;

  @Output() public itemSelected : EventEmitter<any> = new EventEmitter();

  // @Input() public imagePath: string | undefined;
  // @Input() public fileName: string | undefined;
  // @Input() public description: string | undefined;

  constructor() { }

  ngOnInit(): void {
    // console.log(this.item?.imagePath);
  }

  itemClick(event: any){
    this.itemSelected?.emit(this.item);
  }

}
