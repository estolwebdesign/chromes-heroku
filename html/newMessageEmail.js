exports.newMessageEmail = (transaction, user) => {
    return `<!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/x-icon" href="https://chromesw.app/chromeswap-icon.ico">
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title></title>
        <style>
          @import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@300&display=swap");
    
          .w-500 {
            width: 100%;
            max-width: 500px;
          }
          .center {
            text-align: center;
          }
          .bg-light {
            background-color: #f8f9fa;
          }
          .bg-qatar {
            background-color: #5c0931;
          }
          .border {
            box-sizing: border-box;
            border-left: 1px solid #ced4da;
            border-right: 1px solid #ced4da;
          }
          .btn-qatar {
            border-radius: 5px;
            padding: 5px 10px;
            text-decoration: none;
            background-color: #5c0931 !important;
            color: #f8f9fa !important;
          }
          .mt-0{
            margin-top: 0;
          }
          .mx-auto {
            margin: 0 auto 0 auto;
          }
          .my-3{
            margin-top: 1rem;
            margin-bottom: 1rem;
          }
          .p-3{
            padding: 1rem;
          }
          .text-light {
            color: #f8f9fa;
          }
    
          body {
            font-family: "Montserrat", sans-serif;
          }
        </style>
      </head>
      <body class="clean-body" style="margin: 0; padding: 0; -webkit-text-size-adjust: 100%; background-color: #f8f9fa">
        <header style="display: flex">
          <div class="w-500 bg-qatar mx-auto" style="border-radius: 10px 10px 0 0">
            <a style="text-decoration: none" class="text-light" href="https://chromesw.app/" target="_blank" rel="noopener noreferrer">
              <h1 class="center">ChromeSwapp</h1>
            </a>
          </div>
        </header>
        <main style="display: flex" class="bg-light">
          <section class="w-500 mx-auto border p-3">
            <h2 class="center mt-0">Nuevo mensaje recibido.</h2>
            <p>Hola ${user.username},</p>
            <p>Has recibido un nuevo mensaje de ${transaction.from.username === user.username ? transaction.to.username : transaction.from.username} en su intercambio por las figuritas ${transaction.chromes[0].name} y ${transaction.chromes[1].name}.</p>
            <p>Para responderle puedes ingresara tu cuenta de ChromeSwapp a la seccion "Mis intercambios".</p>
            <p style="margin-top: 20px"><small>No respondas a esta casilla de correo electrónico, si tienes alguna duda pod favor contactanos desde nuestro fromulario de contacto en la pagina de <a href="https://chromesw.app/contact" target="_blank" rel="noopener noreferrer">chromesw.app</a></small></p>
          </section>
        </main>
        <footer style="display: flex">
          <div class="w-500 bg-qatar mx-auto center text-light" style="border-radius: 0 0 10px 10px;">
            <div class="my-3">ChromeSwapp by <a class="text-light" href="http://estebanolivera.com" target="_blank" rel="noopener noreferrer">EstebanOlivera.com</a></div>
          </div>
        </footer>
      </body>
    </html>
    `;
  };
  