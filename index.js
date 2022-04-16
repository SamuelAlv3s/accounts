const inquirer = require("inquirer");
const chalk = require("chalk");
const fs = require("fs");

function operation() {
  inquirer
    .prompt({
      type: "list",
      name: "action",
      choices: [
        "Criar Conta",
        "Consultar Saldo",
        "Depositar",
        "Sacar",
        "Transferir",
        "Sair",
      ],
    })
    .then((answer) => {
      const action = answer.action;

      switch (action) {
        case "Criar Conta":
          createAccount();
          break;
        case "Depositar":
          deposit();
          break;
        case "Consultar Saldo":
          consult();
          break;
        case "Sacar":
          withdraw();
          break;
        case "Sair":
          console.log(chalk.bgBlue.black("Obrigado por usar o Accounts"));
          process.exit();
        default:
          console.log("nops");
      }
    })
    .catch((err) => console.log(err));
}

function createAccount() {
  console.log(chalk.bgGreen.black("Parabéns por escolher o nosso banco!"));
  console.log(chalk.green("Defina as opções da sua conta a seguir"));
  buildAccount();
}

function buildAccount() {
  inquirer
    .prompt({
      name: "accountName",
      message: "Digite um nome para sua conta:",
    })
    .then((answer) => {
      console.info(answer.accountName);

      if (!fs.existsSync("accounts")) {
        fs.mkdirSync("accounts");
      }

      if (fs.existsSync(`accounts/${answer.accountName}`)) {
        console.log(
          chalk.bgRed.black("Esta conta já existe, escolha outro nome!")
        );
        buildAccount();
        return;
      }

      fs.writeFileSync(
        `accounts/${answer.accountName}.json`,
        `{"balance": 0}`,
        (err) => {
          console.log(err);
        }
      );
      operation();
      console.log(chalk.green("\nParabéns, a sua conta foi criada!"));
    })
    .catch((err) => console.log(err));
}

function deposit() {
  inquirer
    .prompt({
      name: "accountName",
      message: "Qual o nome da sua Conta ?",
    })
    .then((answer) => {
      if (!checkAccount(answer.accountName)) {
        return deposit();
      }

      inquirer
        .prompt({
          name: "amount",
          message: "Quanto você deseja depositar ?",
        })
        .then((value) => {
          addAmount(answer.accountName, value.amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function consult() {
  inquirer
    .prompt({
      name: "accountName",
      message: "Qual o nome da sua Conta ?",
    })
    .then((answer) => {
      if (!checkAccount(answer.accountName)) {
        return consult();
      }

      const accountData = getAccount(answer.accountName);

      console.log(chalk.bgGreen.black(`O seu saldo é: ${accountData.balance}`));
      operation();
    })
    .catch((err) => console.log(err));
}

function withdraw() {
  inquirer
    .prompt({
      name: "accountName",
      message: "Qual o nome da sua Conta ?",
    })
    .then((answer) => {
      if (!checkAccount(answer.accountName)) {
        return deposit();
      }

      inquirer
        .prompt({
          name: "amount",
          message: "Quanto você deseja sacar ?",
        })
        .then((value) => {
          RemoveAmount(answer.accountName, value.amount);
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
}

function checkAccount(accountName) {
  if (!fs.existsSync(`accounts/${accountName}.json`)) {
    console.log(
      chalk.bgRed.black("Esta conta não existe, escolha outro nome!")
    );
    return false;
  }

  return true;
}

function addAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde")
    );
    return deposit();
  }

  accountData.balance = parseFloat(amount) + parseFloat(accountData.balance);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.log(err)
  );

  console.log(
    chalk.green(`Foi depositado o valor de R$${amount} na sua conta!`)
  );
  operation();
}

function RemoveAmount(accountName, amount) {
  const accountData = getAccount(accountName);

  if (!amount) {
    console.log(
      chalk.bgRed.black("Ocorreu um erro, tente novamente mais tarde")
    );
    return deposit();
  }

  accountData.balance = parseFloat(accountData.balance) - parseFloat(amount);

  fs.writeFileSync(
    `accounts/${accountName}.json`,
    JSON.stringify(accountData),
    (err) => console.log(err)
  );

  console.log(chalk.green(`Foi retirado o valor de R$${amount} na sua conta!`));
  operation();
}

function getAccount(accountName) {
  const accountJson = fs.readFileSync(`accounts/${accountName}.json`, {
    encoding: "utf8",
    flag: "r",
  });

  return JSON.parse(accountJson);
}
operation();
