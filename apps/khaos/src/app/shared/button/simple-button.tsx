import { ButtonProps } from './type/ButtonProps';

function SimpleButton({icon: Icon, text, onClick, fit, center}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        (fit ? "w-fit " : "w-full ") +
        (center ? "flex justify-center " : "") +
        'rounded text-neutral-950 hover:bg-neutral-100 p-2 px-3'
      }
    >
      <p className="flex gap-4">
        {Icon && <Icon size={24} />} {text}
      </p>
    </button>
  );
}

export default SimpleButton;
