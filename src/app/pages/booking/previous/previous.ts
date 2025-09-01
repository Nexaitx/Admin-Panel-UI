import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-previous',
  imports: [],
  templateUrl: './previous.html',
  styleUrl: './previous.scss'
})
export class Previous {
  @Input() booking: any;

  ngOnInit() { console.log(this.booking); }
}
