import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AlkemiaPraesidiumAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("alkemiaAccessEmail", "guest@aries76.com");
    navigate("/alkemia-praesidium-proposal", { replace: true });
  }, [navigate]);

  return null;
};

export default AlkemiaPraesidiumAccess;
