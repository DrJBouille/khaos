import { NormalTextProps } from './type/TextProps';

function TitleText({text}: NormalTextProps) {
  return(
    <h1 className="text-neutral-950 text-3xl font-semibold">{text}</h1>
  );
}

export default TitleText;
