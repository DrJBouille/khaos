import { NormalTextProps } from './type/TextProps';

function NormalText({text}: NormalTextProps) {
  return(
    <p className="text-zinc-500">{text}</p>
  );
}

export default NormalText;
