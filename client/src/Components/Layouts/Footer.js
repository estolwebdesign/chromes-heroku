import React from "react";
import useAnalyticsEventTracker from "../../Hooks/useAnalyticsEventTracker";

const Footer = () => {
  const gaEventTracker = useAnalyticsEventTracker("Footer");

  return (
    <footer className="bg-qatar text-light text-center pt-2 fixed-bottom">
      <small>
        Desarrollado por{" "}
        <a
          href="http://estebanolivera.com"
          target="_blanck"
          className="text-reset"
          onClick={() => gaEventTracker("visit portfolio")}
        >
          Esteban Olivera
        </a>
        &#174;
      </small>
    </footer>
  );
};

export default Footer;
