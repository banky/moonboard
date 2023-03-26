import Link from "next/link";
import { Close } from "svg/close";
import { IconButton } from "./icon-button";
import { Modal } from "./modal";
import { ModalOption } from "./modal-option";

type CreateMoonboardTypeModalProps = {
  showDialog: boolean;
  close: () => void;
};

export const CreateMoonboardTypeModal = ({
  showDialog,
  close,
}: CreateMoonboardTypeModalProps) => {
  return (
    <Modal isOpen={showDialog} onDismiss={close}>
      <div className="m-4">
        <div className="flex justify-between">
          <div>
            <h3>Create Moonboard</h3>
            <p className="">
              Choose what content you want to put into your board
            </p>
          </div>

          <IconButton className="" onClick={close}>
            <Close />
          </IconButton>
        </div>

        <div className="h-0.5 -mx-4 bg-outlines my-4" />

        <div className="grid grid-cols-2 gap-4">
          <Link href="/create-moonboard">
            <ModalOption>From uploaded images</ModalOption>
          </Link>
          <ModalOption disabled>
            From another moonboard (coming soon)
          </ModalOption>
          <ModalOption disabled>From your wallet (coming soon)</ModalOption>
          <ModalOption disabled>From your pins (coming soon)</ModalOption>
        </div>
      </div>
    </Modal>
  );
};
