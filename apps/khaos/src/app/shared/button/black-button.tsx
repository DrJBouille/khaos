import { ButtonProps } from './type/ButtonProps';

function BlackButton({text, onClick, type}: ButtonProps) {
  return(
    <button
      type={type} onClick={onClick}
      className="w-full rounded bg-neutral-950 hover:bg-zinc-800 text-white py-2 font-semibold"
    >
      {text}
    </button>
  );
}

export default BlackButton;
