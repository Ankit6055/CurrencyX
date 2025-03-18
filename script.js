const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const message = document.querySelector(".msg");
const swapper = document.querySelector(".dropdown i");

for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    if (select.name === "from" && currCode === "INR") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "USD") {
      newOption.selected = true;
    }
    select.append(newOption);
  }

  select.addEventListener("change", (e) => {
    updateFlag(e.target);
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", async (e) => {
  if (e.key === "Enter") {
    btn.click();
  }
  e.preventDefault();
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = 1;
  }

  updatePrice();
});

swapper.addEventListener("click", () => {
  let fromValue = fromCurr.value;
  let toValue = toCurr.value;

  // Swap values
  fromCurr.value = toValue;
  toCurr.value = fromValue;

  updateFlag(fromCurr);
  updateFlag(toCurr);

  updatePrice();
});

async function updatePrice() {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;

  let lowerFromCurr = fromCurr.value.toLowerCase();
  let lowerToCurr = toCurr.value.toLowerCase();

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  let response = await fetch(URL);
  let data = await response.json();

  let currObj = data[lowerFromCurr];

  let currvalue = 0;

  for (let key in currObj) {
    // find inr value
    if (key === lowerToCurr) {
      currvalue = currObj[key];
    }
  }

  let result = (amtVal * currvalue).toFixed(2);
  message.innerText = `${amtVal} ${fromCurr.value} = ${result} ${toCurr.value}`;
}

window.addEventListener("load", updatePrice);