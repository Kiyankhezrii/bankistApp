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

let currentAcc;

// render movments
const renderMovments = function (acc) {
  acc.movements.forEach((m, i) => {
    const date = new Date(acc.movementsDates[i]);
    const type = m > 0 ? "deposit" : "withdrawal";
    const html = `
        <div class="movment">
            <div class="movment-left">
              <p class="movments-number ${type}">${i + 1} ${type}</p>
              <p class="movments-date">${date.getDay()}/${date.getMonth()}/${date.getFullYear()}</p>
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
  const income = acc.movements
    .filter((m) => m > 0)
    .reduce((acc, cur) => acc + cur, 0);
  incoms.textContent = income.toFixed(2);

  outcome.textContent = acc.movements
    .filter((m) => m < 0)
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2)
    .replace("-", "");

  interest.textContent = (income * acc.interestRate).toFixed(2);
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
    // content.style.opacity = "1";
  }
};

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
