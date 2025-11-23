import Swal from "sweetalert2";

export default function OfferDetailModal({ 
  title, 
  html, 
  icon, 
  confirmText, 
  cancelText, 
  confirmCallback, 
  cancelCallback 
}) {
  return Swal.fire({
    title,
    html,
    icon,
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    customClass: {
      confirmButton: "btn-gradient",
      cancelButton: "btn-cancel",
    },
    buttonsStyling: false,
    footer: "Tienes dudas, contacta a ventas al 3123456789.",
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

