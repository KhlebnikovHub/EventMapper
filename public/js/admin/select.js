const $period = document.querySelector('#period');
const $inputcontainer = document.querySelector('#inputcontainer');


$period.addEventListener('click', async (event) => {

  $inputcontainer.innerHTML = `
  
  <div class='place_main2'>
  <form class="col s12">
    <div class="row">
      <div class="input-field col s10"> С какой даты
      <input id="date1" type="datetime-local" class="validate" name = "datefrom">
      </div>
      <div class="input-field col s10"> По какую дату
        <input id="date2" type="datetime-local" class="validate" name = "dateto">
      </div>
      
    </div>
    
    </div>
    <button id="showmap" class="btn modal-trigger">Посмотреть</button>
  
  
  `

  $showmap = document.querySelector('#showmap');

  $showmap.addEventListener('click', async (event) => {
    const datefrom = document.querySelector('#date1').value;
    const dateto = document.querySelector('#date2').value;



    const response = await fetch('/event/map/period', {
      method: "POST",
      headers: { 'Content-Type' : 'application/json;charset=utf-8' },
      body: JSON.stringify({ datefrom, dateto })
    });
  
    if (response.ok) {
    const answer = await response.json();
    console.log(answer);  
    }


  })


})
