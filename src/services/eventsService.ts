export async function getEventsData() {
  const response = await fetch('http://localhost:3000/event'); 

  if (!response.ok) throw new Error('Error al obtener la información principal');
  return response.json();
}
