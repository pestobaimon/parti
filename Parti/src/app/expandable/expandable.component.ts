import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-expandable',
  templateUrl: './expandable.component.html',
  styleUrls: ['./expandable.component.scss'],
})
export class ExpandableComponent{

  @Input('expanded') expanded;
  @Input('expandHeight') expandedHeight;

  currentHeight:number = 0;

  constructor() { }

  ngAfterViewInit(){
  }
}
