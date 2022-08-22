import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
// import API from '../fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function fetchCountries(name) {
  const BASE_URL = 'https://restcountries.com/v3.1';
  const URL = `${BASE_URL}/name/${name}?fields=name,capital,population,flags,languages`;

  return fetch(URL).then(response => response.json());
}

function searchCountry(e) {
  e.preventDefault();

  const countryName = refs.inputRef.value.trim();

  fetchCountries(countryName)
    .then(renderCountryCard)
    .catch(error => {
      clearData();
      Notiflix.Notify.info('Oops, there is no country with that name');
    });
}

function clearData() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function renderCountryCard(countries) {
  console.log(countries);
  clearData();

  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length === 1) {
    refs.countryInfo.innerHTML = createCountriesList(countries[0]);
  } else {
    let countryListMarkUp = '';

    countries.map(country => (countryListMarkUp += createListItem(country)));
    // countries.reduce((acc, country) => acc + createListItem(country), '');

    refs.countryList.insertAdjacentHTML('beforeend', countryListMarkUp);
  }
}

function createListItem({ name, flags }) {
  return `
    <li class="countries__list">
        <img class="flag-img" src="${flags.svg}" alt="flag" width="45" height="30"> <p class="name-countries"><b>${name.common}</b></p>
    </li>`;
}

function createCountriesList({ name, capital, population, languages, flags }) {
  return `
    <div class="country-info__card">
    <h2 class="country-info__name">${name.common}</h2>
    <img src="${flags.svg}" class="country-info__flag" width="200px" height="120px">
    <ul class="country-info__features">
        <li class="country-info__feature">
            <h3>Capital:&nbsp;</h3>
            <p>${capital}</p>
        </li>
        <li class="country-info__feature">
            <h3>Population:&nbsp;</h3>
            <p>${population}</p>
        </li>
        <li class="country-info__feature">
            <h3>Languages:&nbsp;</h3>
            <p>${Object.values(languages)}</p>
        </li>
    </ul>
    </div>
    `;
}
