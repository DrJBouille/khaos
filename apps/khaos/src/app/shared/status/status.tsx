import {StatusProps} from "./type/StatusProps";
import {STATUS_COLORS} from "./type/StatusColor";

function Status({status}: StatusProps) {
  return(
    <p className={`${STATUS_COLORS[status].textColor} ${STATUS_COLORS[status].primaryColor} p-2 px-4 w-fit rounded-lg font-semibold`}>{status}</p>
  );
}

export default Status;
