import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../services/data-service.service';
import { JiraDataItem } from '../models/status-history.model';

interface FlatStatus {
  status: string;
  duration: number;
}

@Component({
  selector: 'app-chart-area',
  templateUrl: './chart-area.component.html',
  styleUrls: ['./chart-area.component.css']
})
export class ChartAreaComponent implements OnInit {
  constructor(private dataService: DataService) {}
  query = 'project = CP and sprint in openSprints()';

  public chartDataFiltered: Array<JiraDataItem> = [];

  public chartLabelsFiltered: Array<string> = [];

  public chartDataTotal: Array<number> = [];
  public chartData: Array<JiraDataItem> = [];
  public chartUnselected: Array<number> = [];

  // TODO change to dynamic status instead of hardcoded
  public chartLabels: Array<string> = [
    'To Do',
    'Blocked',
    'In Progress',
    'Code Review',
    'Done'
  ];

  public chartOptions: any = {
    responsive: true,
    tooltips: {
      callbacks: {
        label: function(tooltipItem, data) {
          const item = data.datasets[tooltipItem.datasetIndex];
          const total = +tooltipItem.value;
          let label = `${item.label}`;
          label += item.description
            ? ` ${item.description} (${item.status}): `
            : ': ';
          if (total < 1) {
            return label + (total * 24).toFixed(2) + ' hours';
          }
          return label + total.toFixed(2) + ' days';
        }
      }
    }
  };

  public chartLegend = true;
  public chartType = 'bar';

  ngOnInit() {
    this.createChart();
  }

  // TODO change to dynamic status instead of hardcoded
  createChart() {
    this.dataService.getDaysPerStatus(this.query).subscribe(data => {
      //console.log('tickets from jira:'); console.dir(data);
      const chartData = <JiraDataItem[]>data.map(d => {
        //console.log("data:"); console.dir(d);
        // map to buckets of To Do, In Progress, Blocked, Done
        return {
          label: d.key,
          description: d.title,
          status: d.status,
          data: (function(element) {
            const duration = 86400000; // days
            const flattenedStatus: FlatStatus[] = [];
            if (element.statusHistory.length === 0) {
              // consider only current state as there is no status history recorded
              flattenedStatus.push({
                status: element.status,
                duration:
                  Math.abs(Date.now() - new Date(element.created).getTime()) /
                  duration
              });
            } else {
              element.statusHistory.forEach(sh => {
                let statusName = '';
                switch (
                  sh.from
                    .split(' ')
                    .join('')
                    .toLowerCase()
                ) {
                  case 'todo':
                    statusName = 'To Do';
                    break;
                  case 'blocked':
                    statusName = 'Blocked';
                    break;
                  case 'inprogress':
                    statusName = 'In Progress';
                    break;
                  case 'codereview':
                    statusName = 'Code Review';
                    break;
                  case 'done':
                    statusName = 'Done';
                    break;
                  default:
                    statusName = 'Not mapped: ' + sh.from;
                    console.error(
                      `status not mapped for ${d.key}: ${statusName}`
                    );
                    break;
                }
                // add or update // TODO: specialized Dic-object for that
                if (flattenedStatus.find(i => i.status === statusName)) {
                  const fs = flattenedStatus.find(i => i.status === statusName);
                  fs.duration += sh.transitionDurationDays;
                } else {
                  flattenedStatus.push({
                    status: statusName,
                    duration: sh.transitionDurationDays
                  });
                }
              });
            }

            // map to buckets of To Do, In Progress, Blocked, Done
            const arr: Array<number> = [];
            let tmpVal: FlatStatus;
            arr.push(
              (tmpVal = flattenedStatus.find(i => i.status === 'To Do'))
                ? tmpVal.duration
                : 0
            );
            arr.push(
              (tmpVal = flattenedStatus.find(i => i.status === 'Blocked'))
                ? tmpVal.duration
                : 0
            );
            arr.push(
              (tmpVal = flattenedStatus.find(i => i.status === 'In Progress'))
                ? tmpVal.duration
                : 0
            );
            arr.push(
              (tmpVal = flattenedStatus.find(i => i.status === 'Code Review'))
                ? tmpVal.duration
                : 0
            );
            arr.push(
              (tmpVal = flattenedStatus.find(i => i.status === 'Done'))
                ? tmpVal.duration
                : 0
            );
            return arr;
          })(d)
        };
      });

      this.chartData = chartData;
      this.calculateAverage();

      this.chartDataFiltered = this.chartData;
      this.chartLabelsFiltered = this.chartLabels;
    });
  }

  public calculateAverage() {
    const average = {
      label: 'Average',
      type: 'line',
      visible: false,
      data: Array<number>()
    };
    const control: Array<number> = [];

    for (let l = 0; l < this.chartLabels.length; l++) {
      average.data[l] = 0;
      control[l] = 0;
    }

    for (const d of this.chartData) {
      for (let _i = 0; _i < d.data.length; _i++) {
        if (d.data[_i] > 0) {
          control[_i]++;
          average.data[_i] += d.data[_i];
        }
      }
    }
    for (const index in average.data) {
      if (control[index] > 0) {
        this.chartDataTotal[index] = average.data[index];
        average.data[index] = average.data[index] / control[index];
      }
    }
    console.log(this.chartDataTotal);
    this.chartData.push(average);
  }

  // events
  public chartClicked(e: any): void {
    if (e.active.length > 0) {
      const chart = e.active[0]._chart;
      const activePoints = chart.getElementAtEvent(e.event);
      if (activePoints.length > 0) {
        const datasetLabel = activePoints[0]._model.datasetLabel;
        // get the internal index of slice in chart
        const clickedElementIndex = activePoints[0]._index;
        const label = chart.data.labels[clickedElementIndex];
        // get value by index
        const value = chart.data.datasets[0].data[clickedElementIndex];
        // console.log(clickedElementIndex, label, value, datasetLabel)
        if (datasetLabel) {
          window.open(
            'https://smith-nephew.atlassian.net/browse/' + datasetLabel,
            '_blank'
          );
        }
      }
    }
  }

  public chartHovered(e: any): void {
    // console.log(e);
  }

  onEnter(value: string) {
    this.chartDataFiltered = [];
    this.query = value;
    this.selectAllSeries();
    this.createChart();
  }

  selectAllSeries() {
    const checkboxes = document.getElementsByName('checkbox');
    for (var checkbox in checkboxes) {
      // select when refreshing data
    }
  }

  CheckFieldsChange(values: any) {
    const index = this.chartLabels.indexOf(values.currentTarget.value);

    if (values.currentTarget.checked) {
      const itemIndex = this.chartUnselected.indexOf(index, 0);
      if (itemIndex > -1) {
        this.chartUnselected.splice(itemIndex, 1);
      }
    } else {
      this.chartUnselected.push(index);
    }
    this.chartLabelsFiltered = this.chartLabels.filter(
      (_, i) => this.chartUnselected.indexOf(i) <= -1
    );

    this.chartDataFiltered = [];
    this.chartData.forEach(element => {
      const newItem: JiraDataItem = new JiraDataItem();
      newItem.label = element.label;
      newItem.description = element.description;
      newItem.status = element.status;
      newItem.type = element.type;
      newItem.data = element.data.filter(
        (_, i) => this.chartUnselected.indexOf(i) <= -1
      );

      this.chartDataFiltered.push(newItem);
    });
  }
}
