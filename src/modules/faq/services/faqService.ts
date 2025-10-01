
export async function getFaqs() {
  const response = await fetch('http://localhost:3000/faq'); 

  if (!response.ok) throw new Error('Error al obtener la información principal');
  return response.json();
}

