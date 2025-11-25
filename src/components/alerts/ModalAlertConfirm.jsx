import Swal from "sweetalert2";

export default function ModalAlertConfirm({ title, text, icon, confirmText, cancelText, confirmCallback, cancelCallback, isShowConfirmButton = true, isShowCancelButton = true, isAllowOutsideClick = false }) {
  return new Promise((_, reject) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showConfirmButton: isShowConfirmButton,
      showCancelButton: isShowCancelButton,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      allowOutsideClick: isAllowOutsideClick,
      
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      } else {
        // reject();
      }
    });
  });
}

