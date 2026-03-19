import { ButtonProps } from './type/ButtonProps';

function SquareIconButton({ icon: Icon, onClick }: ButtonProps) {
  if (!Icon) return;

  return (
    <button
      className=""
      onClick={onClick}
    >
      <Icon size={24}/>
    </button>
  );
}

export default SquareIconButton;
