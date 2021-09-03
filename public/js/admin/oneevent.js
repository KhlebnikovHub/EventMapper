$deleteButton = document.querySelector('#delete');

$deleteButton.addEventListener('click', async (event) => {
  
  const eventId = $deleteButton.closest('[data-id]').dataset.id;
  console.log(eventId);
  const response = await fetch(`/event/one/${eventId}/`, {
    method: "DELETE",
    headers: { 'Content-Type' : 'application/json;charset=utf-8' },
    body: JSON.stringify({ eventId })
  })
  if(response.ok) {
    document.location.assign('/');
  }
  
})
