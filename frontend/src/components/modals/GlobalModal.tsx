import { ModalWrapper } from "./ModalWrapper";
import { useModalStore } from "../../storage/modalStore";
import { modalRegistry } from "./ModalRegistry";

export const GlobalModal = () => {
  const data = useModalStore((state) => state.data);
  const closeModal = useModalStore((state) => state.closeModal);

  if (!data) return null;

  if (data.type === "createListSuccess") {
    const ModalContent = modalRegistry.createListSuccess;
    return (
      <ModalWrapper open title={data.title} onClose={closeModal}>
        <ModalContent {...data} onClose={closeModal} />
      </ModalWrapper>
    );
  }

  if (data.type === "savedLists") {
    const ModalContent = modalRegistry.savedLists;
    return (
      <ModalWrapper open title={data.title} onClose={closeModal}>
        <ModalContent {...data} onClose={closeModal} />
      </ModalWrapper>
    );
  }
};
