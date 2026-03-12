import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useInactivityLogout = (logout, timeout = 600000) => {
 const navigate = useNavigate();

 useEffect(() => {
  let timer;

  const resetTimer = () => {
   clearTimeout(timer);

   timer = setTimeout(() => {
    logout();
    navigate("/");
   }, timeout);
  };

  const events = ["mousemove", "keydown", "click", "scroll"];

  events.forEach((event) =>
   window.addEventListener(event, resetTimer)
  );

  resetTimer();

  return () => {
   clearTimeout(timer);
   events.forEach((event) =>
    window.removeEventListener(event, resetTimer)
   );
  };
 }, [logout, navigate, timeout]);
};

export default useInactivityLogout;