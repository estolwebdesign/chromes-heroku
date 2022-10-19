import React from "react";

const Greeting = () => {
  return (
    <section id="wellcome" className="bg-light rounded shadow mt-3 p-3">
      <h1 className=" text-center fw-bold text-qatar">Bienvenido a ChromeSwapp!!!</h1>
      <p className="text-center fw-bold">Bienvenido a ChromeSwapp, el primer sitio de intercambio de figuritas del mundial Qatar 2022.</p>
      <div className="text-justify">
        <p>
          En ChromeSwapp podras registrar tus figuritas, las que tienes sin repetir y las repetidas. Luego vas a poder buscar las figuritas repetidas de las personas que tienes cerca, ponerte en
          contacto con ellas y programar un encuentro para hacer el intercambio de las figuritas.
        </p>
        <p>
          En un intercambio, después que ambas partes se pongan de acuerdo en que figuritas cambiar, tendrás la posibilidad de chatear con la otra persona para coordinar un encuentro, sin necesidad de
          que le brindes tu teléfono, whatsapp, o ningún otro medio de comunicación que tengas, así que tus datos estarán protegidos.
        </p>
        <p>Esperamos que usando nuestra app puedas intercambiar muchas figuritas y que completes tu álbum.</p>
      </div>
      <h4 className="text-center">Muchas gracias por visitarnos en ChromeSwapp!</h4>
    </section>
  );
};

export default Greeting;
