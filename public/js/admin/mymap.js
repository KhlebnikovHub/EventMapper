var suggestView2;
var arr = [];

const $suggestView = document.querySelector('#suggest2');



async function getPlaces() {

  const response = await fetch('/place/my', {
    method: "POST",
    headers: { 'Content-Type': 'application/json;charset=utf-8' },
    body: JSON.stringify({ quest: 'getPlaces' })
  })

  if (response.ok) {
    const answer = await response.json();
    return answer;
  }

}


ymaps.ready(async function () {

  const allPlaces = await getPlaces();

  var myMap = new ymaps.Map('YMapsID', {
    center: [55.7540, 37.6214],
    zoom: 12,
    // Обратите внимание, что в API 2.1 по умолчанию карта создается с элементами управления.
    // Если вам не нужно их добавлять на карту, в ее параметрах передайте пустой массив в поле controls.
    controls: []
  });

  let placeMarks = [];
  for (let place of allPlaces) {

    let placeMark = new ymaps.Placemark([+place.latitude, +place.longitude], {
      balloonContentBody: `
      <addres>
      <strong>${place.name}</strong>
      <br/>
      Адрес: ${place.address}
      <br/>
      Время работы: ${place.time_work}
      <br>
      Подробнее: <a href="${place.site}">${place.site}</a>
      </addres>
  `,
  hintContent: `<span style="font-size: 14px;">${place.name}</span>`
    }, { preset: 'islands#redDotIcon' });
    placeMarks.push(placeMark);
    arr.push(place.name);
  }

  for (let placeMark of placeMarks) {
    myMap.geoObjects.add(placeMark);
  }

  suggestView2 = new ymaps.SuggestView('suggest2', { provider: provider, results: 3 });

  document.body.addEventListener('click', async (event) => {
    if ($suggestView.value) {
        const foundPlace = allPlaces.find(el => el.name === $suggestView.value);
        myMap.panTo([+foundPlace.latitude, +foundPlace.longitude]).then(function() {
          myMap.setZoom(13);
        });
    }
  })

});






var find = function (arr, find) {
  return arr.filter(function (value) {
    return (value + "").toLowerCase().indexOf(find.toLowerCase()) != -1;
  });
};


var provider = {
  suggest: function (request, options) {
    var res = find(arr, request),
      arrayResult = [],
      results = Math.min(options.results, res.length);
    for (var i = 0; i < results; i++) {
      arrayResult.push({ displayName: res[i], value: res[i] })
    }
    return ymaps.vow.resolve(arrayResult);
  }
};












































































