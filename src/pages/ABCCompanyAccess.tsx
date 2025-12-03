import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ABCCompanyAccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.setItem("abcCompanyAccessEmail", "guest@aries76.com");
    navigate("/abc-company-proposal", { replace: true });
  }, [navigate]);

  return null;
};

export default ABCCompanyAccess;
