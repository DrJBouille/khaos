import {STATUS} from "../status/STATUS_COLOR";

export interface Task {
  id: string;
  dockerProcessId: string;
  status: STATUS;
  duration: number,
  createdAt: string;
}


