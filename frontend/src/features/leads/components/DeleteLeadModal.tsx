import React from 'react';
import Modal from '../../../components/ui/Modal';
import Button from '../../../components/ui/Button';

interface DeleteLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  leadName: string;
  isLoading: boolean;
}

export const DeleteLeadModal: React.FC<DeleteLeadModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  leadName,
  isLoading,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Lead">
      <div className="space-y-4">
        <p className="text-sm text-gray-500">
          Are you sure you want to delete lead <span className="font-medium text-gray-900">{leadName}</span>? This will hide the lead from your list.
        </p>
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={isLoading}>
            Delete Lead
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteLeadModal;
