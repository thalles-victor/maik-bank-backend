import { TransactionAggregate } from 'src/Domain/Aggregates/Transactions.aggregate';

export function signUpHtml(name: string, email: string) {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao MaikBank</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      background-color: #f4f4f9;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .email-container {
      max-width: 600px;
      margin: 30px auto;
      background: #ffffff;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background-color: #007BFF;
      color: #ffffff;
      text-align: center;
      padding: 20px 10px;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 20px;
      line-height: 1.6;
    }
    .content p {
      margin: 0 0 15px;
    }
    .cta {
      display: block;
      margin: 20px auto;
      padding: 10px 20px;
      background-color: #007BFF;
      color: #ffffff;
      text-align: center;
      text-decoration: none;
      border-radius: 4px;
      font-size: 16px;
    }
    .cta:hover {
      background-color: #0056b3;
    }
    .footer {
      text-align: center;
      padding: 10px;
      font-size: 12px;
      color: #777;
      background-color: #f4f4f9;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <h1>Bem-vindo ao MaikBank!</h1>
    </div>
    <div class="content">
      <p>Olá, <strong>${name}</strong></p>
      <p>Obrigado por criar uma conta no <strong>MaikBank</strong>! Estamos animados para ajudar você a gerenciar suas finanças com eficiência e segurança.</p>
      <p>Comece agora a explorar nossos serviços e aproveitar as vantagens que só o MaikBank pode oferecer.</p>
      <a href="https://www.linkedin.com/in/thalles-v%C3%ADctor-130b672a8/" class="cta">Acessar Minha Conta</a>
    </div>
    <div class="footer">
      <p>© 2024 MaikBank. Todos os direitos reservados.</p>
    </div>
  </div>
</body>
</html>
`;
}

export function transactionHtmlEmail(
  name: string,
  email: string,
  {
    id,
    type,
    value,
    accountTargetId,
    accountSenderId,
    status,
    createdAt,
  }: TransactionAggregate,
) {
  return `
  <!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Notificação de Transação - MaikBank</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        background-color: #f4f4f9;
        margin: 0;
        padding: 0;
        color: #333;
      }
      .email-container {
        max-width: 600px;
        margin: 30px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #007BFF;
        color: #ffffff;
        text-align: center;
        padding: 20px 10px;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .content {
        padding: 20px;
        line-height: 1.6;
      }
      .content p {
        margin: 0 0 15px;
      }
      .transaction-details {
        margin-top: 20px;
        background-color: #f9f9f9;
        padding: 10px;
        border-radius: 4px;
      }
      .transaction-details p {
        margin: 5px 0;
      }
      .cta {
        display: block;
        margin: 20px auto;
        padding: 10px 20px;
        background-color: #007BFF;
        color: #ffffff;
        text-align: center;
        text-decoration: none;
        border-radius: 4px;
        font-size: 16px;
      }
      .cta:hover {
        background-color: #0056b3;
      }
      .footer {
        text-align: center;
        padding: 10px;
        font-size: 12px;
        color: #777;
        background-color: #f4f4f9;
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="header">
        <h1>Transação Concluída no MaikBank</h1>
      </div>
      <div class="content">
        <p>Olá, <strong>${name}</strong> <${email}></p>
        <p>Uma transação foi realizada com sucesso em sua conta no MaikBank. Confira os detalhes abaixo:</p>
        
        <div class="transaction-details">
          <p><strong>ID da Transação:</strong> ${id}</p>
          <p><strong>Tipo:</strong> ${type}</p>
          <p><strong>Valor:</strong> R$ ${value}</p>
          <p><strong>ID da Conta de Destino:</strong> ${accountTargetId}</p>
          <p><strong>ID da Conta de Envio:</strong> ${accountSenderId}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Data de Criação:</strong>${createdAt}</p>
        </div>
        
        <p>Se você não reconhece essa transação ou acredita que houve algum erro, por favor, entre em contato com nosso suporte.</p>
        
        <a href="https://www.linkedin.com/in/thalles-v%C3%ADctor-130b672a8/" class="cta">Acessar Minha Conta</a>
      </div>
      <div class="footer">
        <p>© 2024 MaikBank. Todos os direitos reservados.</p>
      </div>
    </div>
  </body>
  </html>
  `;
}
