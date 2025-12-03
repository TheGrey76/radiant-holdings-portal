import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const VettaFiAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("vettafiAccessEmail", "guest@aries76.com");
    navigate("/vettafi-proposal", { replace: true });
  }, [navigate]);

  return null;
};

export default VettaFiAccess;
