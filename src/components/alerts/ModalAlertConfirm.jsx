import Swal from "sweetalert2";

export default function ModalAlertConfirm({ title, text, icon, confirmText, cancelText, confirmCallback, cancelCallback, isShowConfirmButton = true, isShowCancelButton = true, isAllowOutsideClick = false, isText = true }) {
  return Swal.fire({
    title: title,
    text: isText ? text : null,
    html: !isText ? text : null,
    icon: icon,
    showConfirmButton: isShowConfirmButton,
    showCancelButton: isShowCancelButton,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    allowOutsideClick: isAllowOutsideClick,
  }).then(async (result) => {
    if (result.isConfirmed) {
      if (confirmCallback) await confirmCallback();
    } else {
      if (cancelCallback) await cancelCallback();
    }
  });
}
