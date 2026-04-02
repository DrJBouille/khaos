import {STATUS} from "../../shared/status/STATUS_COLOR";

export interface TaskResultEvent {
  id: string;
  status: STATUS;
  output: string;
  error: string;
  duration: number;
}
