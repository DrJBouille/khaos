import {Editor} from "@monaco-editor/react";
import {useEffect, useState} from "react";
import SimpleSelect from "./shared/form/select/simple-select";
import {SelectElement} from "./shared/form/select/type/SelectElement";
import {TaskDTO} from "./service/data/TaskDTO";
import {getTaskByID, runTask} from "./service/task-service";
import BlackButton from "./shared/button/black-button";
import {taskSignalingService} from "./service/task-signaling-service";
import {TaskResponse} from "./service/data/TaskReponse";
import Status from "./shared/status/status";
import {STATUS} from "./shared/status/type/StatusColor";

const languages: SelectElement[] = [
  {name: "Javascript", value: "JAVASCRIPT"},
  {name: "Python", value: "PYTHON"},
];

export function App() {
  const [language, setLanguage] = useState("JAVASCRIPT");
  const [code, setCode] = useState("console.log(\"Hello world !\")");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<STATUS>();

  useEffect(() => {
    taskSignalingService.onMessage(updateData);

    return () => {
      taskSignalingService.disconnect();
    };
  }, []);

  const updateData = (data: TaskResponse) => {
    setOutput(data.output);
    setError(data.error);
    setStatus(data.status);
  }

  const run = () => {
    if (status === "RUNNING") return;

    taskSignalingService.disconnect();

    const taskDTO: TaskDTO = {code, language};

    runTask(taskDTO).then(response => {
      taskSignalingService.connect(response.id);
      getTaskByID(response.id).then(updateData);
    });
  }

  return (
    <div className={"w-screen h-screen grid grid-cols-3 gap-4 p-4 text-gray-800"}>
      <div className={"max-h-full col-span-2 border border-zinc-900 rounded-lg overflow-hidden"}>
        <Editor language={language.toLowerCase()} value={code} onChange={(value) => setCode(value ?? "")}/>
      </div>
      <div className={"flex flex-col gap-4"}>
        <div className="flex gap-4">
          <SimpleSelect elements={languages} onChange={setLanguage}/>
          <div className={"w-1/5"}><BlackButton onClick={run} text="Run"/></div>
        </div>

        {status && <Status status={status}/>}

        <pre className="w-full flex-1 border border-zinc-900 rounded p-4 h-64 overflow-scroll">
          {output}
        </pre>

        {error != "" &&
          <pre className="w-full flex-1 border border-zinc-900 rounded text-red-600 p-4 h-64 overflow-scroll">
            {error}
          </pre>
        }
      </div>
    </div>
  );
}

export default App;

