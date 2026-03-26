import Swal from "sweetalert2";
import "./css/toast.css";

export default function ToastAlert({ position, timer, icon, title, isColored }) {

  const showToast = () => {
    return new Promise((resolve) => {
      const Toast = Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        iconColor: isColored ? 'white' : 'auto',
        customClass: {
          popup: isColored ? 'colored-toast' : '',
        },
        didOpen: (toast) => {
            toast.onmouseleave = Swal.resumeTimer;
        },
        willClose: () => {
            resolve();
        }
      });
      Toast.fire({
        icon: icon,
        title: title
      });
    });
  }

  return ( 
    showToast()
  );
}

