import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import fetchCountries from '../fetchCountries';

const DEBOUNCE_DELAY = 300;

const refs = {
  inputRef: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.inputRef.addEventListener('input', debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(e) {
  e.preventDefault();

  const countryName = refs.inputRef.value.trim();

  fetchCountries(countryName)
    .then(renderCountriesCard)
    .catch(error => {
      Notiflix.Notify.failure('Oops, there is no country with that name');
    });
}

function clearData() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

function renderCountriesCard(countries) {
  console.log(countries);
  clearData();

  if (countries.length > 10) {
    Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length === 1) {
    refs.countryInfo.innerHTML = createCountryCard(countries[0]);
  } else {
    let countryListMarkUp = '';

    countries.map(country => (countryListMarkUp += createCountriesList(country)));
    refs.countryList.insertAdjacentHTML('beforeend', countryListMarkUp);
  }
}

function createCountriesList({ name, flags }) {
  return `
    <li class="countries__list">
        <img class="flag-img" src="${flags.svg}" alt="flag" width="45" height="30"> <p class="name-countries"><b>${name.official}</b></p>
    </li>`;
}

function createCountryCard({ name, capital, population, languages, flags }) {
  return `
    <div class="country-info__card">
    <h2 class="country-info__name">${name.official}</h2>
    <img src="${flags.svg}" class="country-info__flag" width="200px" height="150px">
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
