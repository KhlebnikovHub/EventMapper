const $superplace = document.querySelector('.superplace_main2');
var suggestView2;
var arr = [];
const $suggestView = document.querySelector('#suggest2');
const $selectedPlace = document.querySelector('#selectedPlace');
let placeMarkValue;
const $placeEvents = document.querySelector('#placeEvents');  



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

  var myMap = new ymaps.Map('YMapsID2', {
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
    placeMark.name = place.name;
    placeMarks.push(placeMark);
    arr.push(place.name);
  }

  for (let placeMark of placeMarks) {
    myMap.geoObjects.add(placeMark);
    placeMark.events.add('click', async (event) => {
      placeMarkValue = placeMark.name;
      $selectedPlace.innerText = placeMarkValue;
      myMap.panTo(placeMark.geometry.getCoordinates()).then(function () {
        // myMap.setZoom(12);
      });
    })
  }

  suggestView2 = new ymaps.SuggestView('suggest2', { provider: provider, results: 3 });

  document.body.addEventListener('click', async (event) => {
    if ($suggestView.value) {
      $selectedPlace.innerText = $suggestView.value;
      const foundPlace = allPlaces.find(el => el.name === $suggestView.value);
      myMap.panTo([+foundPlace.latitude, +foundPlace.longitude]).then(function () {
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



$superplace.addEventListener('click', async (event) => {
  let place_name;

  if ($suggestView.value) {
    place_name = $suggestView.value;
  } else if (placeMarkValue) {
    place_name = placeMarkValue;
  }

  if (place_name) {


    const responseEvent = await fetch('/event/map/all', {
      method: "POST",
      headers: { 'Content-Type': 'application/json;charset=utf-8' },
      body: JSON.stringify({ place_name })
    });





    if (responseEvent.ok) {
      const answer = await responseEvent.json();
      let allLis = ``;
      for(let oneEvent of answer) {
        allLis += `
        <li class="collection-item avatar">
      <img src="/images/event.png" alt="" class="circle">
      <span class="title">${oneEvent.name}</span>
      <p>${oneEvent.date.slice(0, 10)}
      </p>
      <a href="/event/one/${oneEvent.id}" class="secondary-content"><i class="material-icons">Посмотреть</i></a>
    </li>
        `;
      }
      $placeEvents.innerHTML = `
      <ul class="collection">
      ${allLis}
      </ul>
      `;
      console.log(answer);
    }
    console.log('place_name', place_name);
    place_name = null;
    console.log(place_name);
  }

  

})




