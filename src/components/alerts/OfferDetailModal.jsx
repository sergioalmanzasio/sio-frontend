import Swal from "sweetalert2";

export default function OfferDetailModal({ 
  title, 
  html, 
  icon, 
  confirmText, 
  cancelText, 
  confirmCallback, 
  cancelCallback,
  isCancelButtonVisible = true,
  footerText =  "Tienes dudas, contacta a ventas al 3123456789."
}) {
  return Swal.fire({
    title,
    html,
    icon,
    showCancelButton: isCancelButtonVisible,
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

    // 🔥 ESTA ES LA CLAVE
    preConfirm: async () => {
      const shouldClose = await confirmCallback();

      // ❗ Si confirmCallback retorna false --> NO cerrar modal
      if (shouldClose === false) {
        return false; 
      }

      // Si retorna undefined o true --> cerrar modal
      return true;
    }

  }).then((result) => {
    if (result.dismiss) {
      cancelCallback();
    }
  });
}

