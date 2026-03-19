import { SelectElement } from './type/SelectElement';

interface SimpleSelectProps {
  elements: SelectElement[];
  onChange: (value: string) => void;
  selected?: string;
}

function SimpleSelect({ elements, onChange, selected }: SimpleSelectProps) {
  return (
    <select
      className="w-full rounded-md border bg-background px-3 py-2 bg-white"
      onChange={e => onChange(e.target.value)}
      value={selected}
    >
      {elements.map(element => <option key={element.value} value={element.value}>{element.name}</option>)}
    </select>
  );
}

export default SimpleSelect;
