import { useState, useCallback } from 'react';

interface ModalState<T> {
  open: boolean;
  item: T | null;
  action: string;
}

export default function useActionModal<T>() {
  const [modal, setModal] = useState<ModalState<T>>({
    open: false,
    item: null,
    action: '',
  });

  const openModal = useCallback((item: T, action: string) => {
    setModal({ open: true, item, action });
  }, []);

  const closeModal = useCallback(() => {
    setModal({ open: false, item: null, action: '' });
  }, []);

  return { modal, openModal, closeModal };
}
