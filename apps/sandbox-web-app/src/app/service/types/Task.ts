import {STATUS} from "../../shared/status/STATUS_COLOR";

export interface Task {
  id: string;
  dockerProcessId: string;
  status: STATUS;
  createdAt: string;
}


