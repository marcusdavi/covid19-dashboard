let countries = [];
let countrySelected = "";

const diarioText = "Diário";

let confirmedDate;
let deathDate;
let recoveryDate;
let activeDate;

const tConfirmed = document.getElementById("tconfirmed");
const tRecovered = document.getElementById("trecovered");
const tDeath = document.getElementById("tdeath");
const tActive = document.getElementById("tactive");

const country = document.getElementById("combo");
const confirmed = document.getElementById("confirmed");
const death = document.getElementById("death");
const recovered = document.getElementById("recovered");
const active = document.getElementById("active");
const date = document.getElementById("today");

async function init() {
  countries = await listCountries();
  date.addEventListener("blur", onFilterChange);
  country.addEventListener("change", onFilterChange);
  renderCountries();
  loadTodaysGlobalData();
}

async function onFilterChange() {
  confirmedDate = 0;
  deathDate = 0;
  recoveryDate = 0;
  activeDate = 0;
  countrySelected = country.value;
  if (countrySelected && countrySelected !== "global") {
    const dateParam = date.value ? date.value : new Date();
    const data = await getTodaysData(countrySelected, dateParam);
    console.log(data);
    fillDataCountry(data[0], data[1], data[2]);
  } else {
    loadTodaysGlobalData();
  }
}

async function loadTodaysGlobalData() {
  const globalData = await getTodaysData();
  fillDataGlobal(globalData.Global);
}

function fillDataCountry(dataBeforeTwoDay, dataBeforeOneDay, data) {
  if (data) {
    if (dataBeforeOneDay) {
      const confirmedDateBefore = calculaDiferenca(data.Confirmed,dataBeforeOneDay.Confirmed);
      const deathDateBefore = calculaDiferenca(data.Deaths, dataBeforeOneDay.Deaths);
      const recoveryDateBefore = calculaDiferenca(data.Recovered, dataBeforeOneDay.Recovered);
      const activeDateBefore = calculaDiferenca(data.Active, dataBeforeOneDay.Active);

      const deltaConfirmedDateBefore = calculaDiferenca(dataBeforeTwoDay.Confirmed,dataBeforeOneDay.Confirmed);
      const deltaDeathDateBefore = calculaDiferenca(dataBeforeTwoDay.Deaths, dataBeforeOneDay.Deaths);
      const deltaRecoveryDateBefore = calculaDiferenca(dataBeforeTwoDay.Recovered, dataBeforeOneDay.Recovered);
      const deltaActiveDateBefore = calculaDiferenca(dataBeforeTwoDay.Active, dataBeforeOneDay.Active);

      tConfirmed.textContent = `${diarioText} ${formatNumber(confirmedDateBefore)}`;
      formatPositiveOrNegative(tConfirmed, deltaConfirmedDateBefore);
      tDeath.textContent = `${diarioText} ${formatNumber(deathDateBefore)}`;
      formatPositiveOrNegative(tDeath, deltaDeathDateBefore);
      tRecovered.textContent = `${diarioText} ${formatNumber(recoveryDateBefore)}`;
      formatPositiveOrNegative(tRecovered, deltaRecoveryDateBefore);
      tActive.textContent = `${diarioText} ${formatNumber(activeDateBefore)}`;
      formatPositiveOrNegative(tActive, deltaActiveDateBefore);
    } else {
      tConfirmed.textContent = 0;
      tDeath.textContent = 0;
      tRecovered.textContent = 0;
      tActive.textContent = 0;
    }
    confirmedDate = data.Confirmed;
    deathDate = data.Deaths;
    recoveryDate = data.Recovered;
    activeDate = data.Active;

    confirmed.textContent = formatNumber(confirmedDate);
    death.textContent = formatNumber(deathDate);
    recovered.textContent = formatNumber(recoveryDate);
    active.textContent = formatNumber(activeDate);
  } else {
    toZeroValues();
  }
}

function formatPositiveOrNegative(element, valor) {
  if (valor > 0) {
    element.classList.add("positive");
  } else if (valor < 0) {
    element.classList.add("negative");
  } else {
    element.classList.remove("positive");
    element.classList.remove("negative");
  }
}

function calculaDiferenca(today, before) {
  const resultado = +today - +before;
  return resultado;
}

function toZeroValues() {
  confirmedDate = 0;
  deathDate = 0;
  recoveryDate = 0;
  activeDate = 0;
  confirmed.textContent = confirmedDate;
  death.textContent = deathDate;
  recovered.textContent = recoveryDate;
  active.textContent = activeDate;
}

function fillDataGlobal(data) {
  if (data) {
    confirmed.textContent = formatNumber(data.TotalConfirmed);
    death.textContent = formatNumber(data.TotalDeaths);
    recovered.textContent = formatNumber(data.TotalRecovered);
    active.textContent = formatNumber(
      data.TotalConfirmed - (data.TotalDeaths + data.TotalRecovered)
    );
  } else {
    toZeroValues();
  }
}

function renderCountries() {
  countries.sort((a,b) => {
  if(a.Slug > b.Slug) {
    return 1;
  } else if (a.Slug < b.Slug){
    return -1
  } else {
    return 0;
  }
  });
  
  for (const item of countries) {
    const option = document.createElement("option");
    option.textContent = item.Country;
    option.value = item.Slug;
    country.appendChild(option);
  }
}

function formatNumber(number) {
  return number.toLocaleString("pt-BR");
}

init();
