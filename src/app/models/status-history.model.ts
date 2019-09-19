export class StatusStory {
  fromDateTime: Date;
  toDateTime: Date;
  transitionDurationHours: number;
  transitionDurationDays: number;
  from: string;
  to: string;
}

export class JiraDataItem {
  label: string;
  description?: string;
  status?: string;
  type: string;
  data: number[];
}

export class JiraStatus {
  name: string;
  selected: boolean;
}
