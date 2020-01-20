import { Component, Input } from '@angular/core';



@Component({
  selector: 'ngx-chartjs-multiple-xaxis',
  template: `
  <chart type="line" [data]="data" [options]="options"></chart>
  `,
})
export class ChartjsMultipleXaxisComponent {
  @Input() data: any;
  @Input() options: any;
}
