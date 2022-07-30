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
    .reduce((acc, cur) => acc + cur, 0).toFixed(2).replace("-","");

  interest.textContent = (income * acc.interestRate).toFixed(2);
};

renderMovments(accounts[0]);
calcBalance(accounts[0]);
calcDepoAndWith(accounts[0]);
