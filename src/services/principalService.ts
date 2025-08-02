export async function getPrincipalData() {
  const response = await fetch('http://localhost:3000/principal'); 

  if (!response.ok) throw new Error('Error al obtener la información principal');
  return response.json();
}
