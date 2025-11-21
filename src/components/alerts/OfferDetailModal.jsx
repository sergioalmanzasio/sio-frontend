import Swal from "sweetalert2";
import "./css/button.css";

export default function OfferDetailModal({ title, html, icon, confirmText, cancelText, confirmCallback, cancelCallback }) {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      html: html,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      // AQUI VA LA MAGIA
  customClass: {
    confirmButton: "btn-gradient",
    cancelButton: "btn-cancel",
  },

  buttonsStyling: false,
      footer: "Tienes dudas, contacta a ventas al 3123456789.",
      showCloseButton: true,
      allowOutsideClick: false,
      
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      } else {
        cancelCallback()
      }
    });
  });
}

