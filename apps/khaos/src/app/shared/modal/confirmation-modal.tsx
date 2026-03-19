import TitleText from '../text/title-text';
import NormalText from '../text/normal-text';
import SimpleButton from '../button/simple-button';

interface ConfirmationModalProps {
  title: string;
  text: string;
  cancel: () => void;
  confirm: () => void;
}

function ConfirmationModal({ title, text, confirm, cancel }: ConfirmationModalProps) {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center bg-black/50" onClick={cancel}>
      <div className="w-1/4 bg-white flex flex-col gap-4 p-4 rounded-xl" onClick={(e) => e.stopPropagation()}>
        <TitleText text={title}/>
        <NormalText text={text}/>
        <div className="flex justify-between">
          <SimpleButton text="Cancel" onClick={cancel} center={true}/>
          <SimpleButton text="Confirm" onClick={confirm} center={true}/>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
