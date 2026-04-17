import Swal from "sweetalert2";
import { SALE_CONTACT_PHONE } from '../../shared/constanst';

export default function OfferDetailModal({
  title,
  html,
  icon,
  confirmText,
  cancelText,
  confirmCallback,
  cancelCallback,
  isConfirmButtonVisible = true,
  isCancelButtonVisible = true,
  footerText = `¿Tienes dudas? Contáctanos vía WhatsApp al ${SALE_CONTACT_PHONE}.`
}) {
  return Swal.fire({
    title,
    html,
    icon,
    showCancelButton: isCancelButtonVisible,
    showConfirmButton: isConfirmButtonVisible,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      confirmButton: "btn-gradient",
      cancelButton: "btn-cancel",
    },
    buttonsStyling: false,
    footer: footerText,
    showCloseButton: true,
    allowOutsideClick: false,

    preConfirm: async () => {
      const shouldClose = await confirmCallback();

      if (shouldClose === false) {
        return false;
      }

      return true;
    }

  }).then((result) => {
    if (result.dismiss) {
      cancelCallback();
    }
  });
}

