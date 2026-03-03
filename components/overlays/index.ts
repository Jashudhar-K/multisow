/**
 * Overlay Components
 * ==================
 * Modal, drawer, dialog, and toast components.
 */

// Modal & Dialog
export {
  Modal,
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter,
  ConfirmDialog,
  AlertDialog,
  useModal,
  type ModalProps,
  type ConfirmDialogProps,
  type AlertDialogProps,
} from './Modal';

// Drawer
export {
  Drawer,
  DrawerHeader,
  DrawerTitle,
  DrawerBody,
  DrawerFooter,
  SheetDrawer,
  useDrawer,
  type DrawerProps,
  type SheetDrawerProps,
} from './Drawer';

// Toast & Notifications
export {
  ToastProvider,
  useToast,
  toast,
  setToastRef,
  type Toast,
  type ToastType,
  type ToastPosition,
  type ToastOptions,
  type ToastProviderProps,
} from './Toast';
