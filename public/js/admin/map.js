const $map = document.querySelector('#map');
const $placeInfo = document.querySelector('.place_info');
let selectedPlace;
const $addButton = document.querySelector('#add');

function init() {
  var myMap = new ymaps.Map('map', {
    center: [55.7540, 37.6214],
    zoom: 12,
    controls: []
  });

  // Создадим экземпляр элемента управления «поиск по карте»
  // с установленной опцией провайдера данных для поиска по организациям.
  var searchControl = new ymaps.control.SearchControl({
    options: {
      provider: 'yandex#search'
    }
  });

  myMap.controls.add(searchControl);

  // searchControl.search('Шоколадница');







  $map.addEventListener('click', async (event) => {
    var geoObjectsArray = searchControl.getResultsArray();
    const selectedIndex = searchControl.getSelectedIndex();
    selectedPlace = geoObjectsArray[selectedIndex];

    let site = selectedPlace.properties._data.url; 
    if(site) {
      site = `<a href="${site}">${site}</a>`;
    } else {
      site = 'не указан';
    }
    console.dir(myMap.geoObjects);
    console.log(selectedPlace);
    console.log('SELECTED ----->', selectedIndex);
    $placeInfo.innerHTML = ` <h5>Вы выбрали:</h5>
    <h5>Название: ${selectedPlace.properties._data.name}</h5>
    <h5>Адрес: ${selectedPlace.properties._data.description}</h5>
    <h5>Время работы: ${selectedPlace.properties._data.workingTime}</h5>
    <h8>Сайт: ${site}</h8>
    `
  })

}

ymaps.ready(init);

$addButton.addEventListener('click', async (event) => {

  const response = await fetch('/place/create', {
    method: "POST",
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({
      name: selectedPlace.properties._data.name, 
      address: selectedPlace.properties._data.description,
      time_work: selectedPlace.properties._data.workingTime,
      site: selectedPlace.properties._data.url,
      latitude: `${selectedPlace.geometry._coordinates[0]}`,
      longitude: `${selectedPlace.geometry._coordinates[1]}`
    })
  })

  if (response.ok) {
    const answer = await response.json();
    console.log(answer);
  }

})



