import Swal from "sweetalert2";

export default function ModalAlertConfirm({ title, text, icon, confirmText, cancelText, confirmCallback, cancelCallback }) {
  return new Promise((resolve, reject) => {
    Swal.fire({
      title: title,
      text: text,
      icon: icon,
      showCancelButton: true,
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmCallback();
      } else {
        cancelCallback()
      }
    });
  });
}

