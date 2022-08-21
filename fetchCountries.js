export function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';
  const URL = `${BASE_URL}/name/${name}?fields=name,name,capital,population,flags,languages`;

  return fetch(URL);
}
