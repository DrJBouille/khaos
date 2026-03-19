import {STATUS} from "../../shared/status/type/StatusColor";

export interface TaskResponse {
  id: string,
  status: STATUS,
  output: string,
  error: string
}
