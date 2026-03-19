import { InputProps } from '../type/Input-props';

function SimpleInput({placeholder, minSize, maxSize, isDisabled, onChange}: InputProps) {
  return(
    <input
      type="text"
      className="
        w-full rounded-md border border-input bg-background px-3 py-2
        placeholder:text-muted-foreground
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-zinc-400
        disabled:cursor-not-allowed disabled:opacity-50
      "
      placeholder={placeholder}
      minLength={minSize}
      maxLength={maxSize}
      onChange={(event) => onChange(event.target.value)}
      disabled={isDisabled}
    />
  );
}

export default SimpleInput;
