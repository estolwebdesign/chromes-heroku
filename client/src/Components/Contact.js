import React, { useRef, useState } from "react";
import useForm from "../Hooks/useForm";
import ReCAPTCHA from "react-google-recaptcha";

const Contact = () => {
  const [validCaptcha, setValidCaptcha] = useState(null);
  const [contactForm, handleInputChange] = useForm({
    email: "",
    name: "",
    message: "",
  });

  const { email, name, message } = contactForm;

  const captcha = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const captchaChange = () => {
    if (captcha.current.getValue()) {
      setValidCaptcha(captcha.current.getValue());
    }
  };

  return (
    <main>
      <div className="container-fluid">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-6 col-sm-8">
            <form
              onSubmit={handleSubmit}
              className="bg-light rounded p-3 shadow mt-3"
            >
              <h1 className="text-center">Contactanos</h1>
              <h5 className="text-center">completando este formulario</h5>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleInputChange}
                  className="form-control"
                  value={email}
                />
              </div>
              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  onChange={handleInputChange}
                  className="form-control"
                  value={name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="message">Mensaje</label>
                <textarea
                  rows="7"
                  name="message"
                  id="message"
                  onChange={handleInputChange}
                  className="form-control"
                  value={message}
                ></textarea>
              </div>
              <div className="text-center mt-3">
                <div className="d-flex justify-content-center">
                  <ReCAPTCHA
                    ref={captcha}
                    sitekey="6LdwqYAiAAAAANg7uU026ygVqkJ-svR1D7FgvLD3"
                    onChange={captchaChange}
                  />
                </div>
                {validCaptcha &&
                  <button type="submit" className="btn btn-qatar mt-3 animate__animated animate__fadeInDown">
                    Enviar
                  </button>
                }
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
