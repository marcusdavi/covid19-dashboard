const baseUrl = "https://api.covid19api.com";

function fetchJson(url, options) {
  return fetch(url, options)
    .then((r) => {
      if (r.ok) {
        return r.json();
      } else {
        throw new Error(r.statusText);
      }
    })
    .catch((error) => {
      throw error;
    });
}

function listCountries() {
  return fetchJson(`${baseUrl}/countries`);
}

function getTodaysData(country, date, isBefore) {
  if (country && country != "global" && date) {
    const dateInit = new Date(date);
    const dateEnd = new Date(dateInit - 1 * 24 * 60 * 60 * 1000);
    dateInit.setUTCHours(0, 0, 0, 0);
    dateEnd.setUTCHours(0, 0, 0, 0);
    console.log(`${baseUrl}/country/${country}?from=${dateEnd.toISOString()}&to=${dateInit.toISOString()}`);
    return fetchJson(
      `${baseUrl}/country/${country}?from=${dateEnd.toISOString()}&to=${dateInit.toISOString()}`
    );
  } else {
    return fetchJson(`${baseUrl}/summary`);
  }
}