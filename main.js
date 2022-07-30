import { accounts } from "/acc.js";

// get elements from DOM
const loginForm = document.querySelector(".form");
const movments = document.querySelector(".movments");
const transferForm = document.querySelector(".transfer-form");
const loanForm = document.querySelector(".loan-form");
const closeForm = document.querySelector(".close-form");
const time = document.querySelector(".time-exit");
const topInfo = document.querySelector(".acc-infos");
const incoms = document.querySelector(".incoms span");
const outcome = document.querySelector(".outcome span");
const interest = document.querySelector(".interest span");
const content = document.querySelector(".content");
const cureentUserInfo = document.querySelector(".user-info__name");
const dateNow = document.querySelector(".time");

let currentAcc;
const dt = new Date();

// render movments
const renderMovments = function (acc) {
  acc.movements.forEach((m, i) => {
    const date = new Date(acc.movementsDates[i]);
    const type = m > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movment">
            <div class="movment-left">
              <p class="movments-number ${type}">${i + 1} ${type}</p>
              <p class="movments-date">${(date.getDate() + "").padStart(
                2,
                "0"
              )}/${(date.getMonth() + 1 + "").padStart(
      2,
      "0"
    )}/${date.getFullYear()}</p>
            </div>
            <p class="movments-value">${m} €</p>
          </div>
        `;
    movments.insertAdjacentHTML("afterbegin", html);
  });
};

const calcBalance = function (acc) {
  topInfo.querySelector(".money").textContent = `${acc.movements.reduce(
    (acc, cur) => {
      return acc + cur;
    },
    0
  )} €`;
};

const calcDepoAndWith = function (acc) {
  const inc = acc.movements
    .filter((m) => m > 0)
    .reduce((acc, cur) => acc + cur, 0);

  incoms.textContent = inc.toFixed(2);
  outcome.textContent = acc.movements
    .filter((m) => m < 0)
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2)
    .replace("-", "");

  interest.textContent = (inc * acc.interestRate).toFixed(2);
};

const userName = function (accounts) {
  accounts.forEach((acc) => {
    acc.userName = acc.owner
      .toLowerCase()
      .split(" ")
      .map((w) => w[0])
      .join("");
  });
};

const logins = function (accs) {
  const findAcc = accs.find((acc) => {
    return (
      acc.userName == loginForm.querySelector(".user").value &&
      acc.pin == loginForm.querySelector(".pin").value
    );
  });
  if (findAcc) {
    currentAcc = findAcc;
    content.style.opacity = "1";
    cureentUserInfo.textContent = `Good afternoon,${
      findAcc.owner.split(" ")[0]
    }!`;
    dateNow.textContent = `As ${dt.getDate()}/${(
      dt.getMonth() +
      1 +
      ""
    ).padStart(2, "0")}/${dt.getFullYear()}, ${(dt.getHours() + "").padStart(
      2,
      "0"
    )}:${(dt.getMinutes() + "").padStart(2, "0")}`;
  }
};

transferForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const user = transferForm.querySelector(".users");
  const amount = transferForm.querySelector(".amount");

  const accTransferTo = accounts.find((acc) => acc.userName == user.value);
  const moneyofCurrAcc = currentAcc.movements.reduce(
    (acc, cur) => acc + cur,
    0
  );

  if (amount.value > 0 && amount.value < moneyofCurrAcc) {
    const dateTransfer = new Date().toISOString();

    currentAcc.movements.push(-amount.value);
    accTransferTo.movements.push(+amount.value);

    currentAcc.movementsDates.push(`${dateTransfer}`);
    accTransferTo.movementsDates.push(`${dateTransfer}`);

    init();
  }
  user.value = "";
  amount.value = "";
  amount.blur();
});

loanForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const amountLoans = loanForm.querySelector(".loans").value;
  if (amountLoans > 0) {
    setTimeout(() => {
      const money = (+amountLoans * currentAcc.interestRate).toFixed(2);
      console.log(currentAcc);

      const dateTransfer = new Date().toISOString();
      currentAcc.movements.push(+money);
      currentAcc.movementsDates.push(`${dateTransfer}`);
      init();
    }, 1000);
  }
  loanForm.querySelector(".loans").value = "";
});

closeForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const closeAccName = e.target.querySelector(".closeAcc");
  const closeAccPin = e.target.querySelector(".closePin");
  if (
    closeAccName.value === currentAcc.userName &&
    +closeAccPin.value === currentAcc.pin
  ) {
    content.style.opacity = "0";
    cureentUserInfo.textContent = `Login to get started`;
    closeAccName.value = closeAccPin.value = "";
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  logins(accounts);
  loginForm.querySelector(".user").value = "";
  loginForm.querySelector(".pin").value = "";
  loginForm.querySelector(".pin").blur();
  init();
});

const init = function () {
  renderMovments(currentAcc);
  calcBalance(currentAcc);
  calcDepoAndWith(currentAcc);
};
userName(accounts);
