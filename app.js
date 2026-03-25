/** Array para guardar los contactos */
let contactos = []; 

/* Referencias al HTML */
const form = document.getElementById('contactForm'); // Formulario
const lista = document.getElementById('listaContactos'); // Donde aparecen los contactos
const mensaje = document.getElementById('mensaje'); // Mensajes de error o éxito
const busqueda = document.getElementById('busqueda'); // Buscar contacto
const totalEl = document.getElementById('total'); // Total de contactos

/* --- CARGAR CONTACTOS --- */
window.addEventListener('load', () => {
  const data = localStorage.getItem('contactos'); // Trae datos guardados
  if(data) { 
    contactos = JSON.parse(data); // Convierte de JSON a array
    render(contactos); // Muestra contactos
  }
});

const limpiarBtn = document.getElementById('limpiarBtn');

limpiarBtn.onclick = () => {
  form.reset(); //limpia todos los inputs del formulario
 
};

/* --- GUARDAR CONTACTOS --- */
const guardar = () => localStorage.setItem('contactos', JSON.stringify(contactos)); // Guarda contactos stringify convierte el array en texto

/* --- MOSTRAR CONTACTOS --- */
function render(list) {
  lista.innerHTML = ''; // Limpia la lista
  list.forEach(c => {  //Recorro los contactos 
    const div = document.createElement('div'); 
    div.className = 'contacto'; 
    div.innerHTML = `
      <strong>${c.nombre}</strong>
      <div class="info">
        <span>${c.telefono}</span>
        <span>${c.email}</span>
        <span>${c.etiquetas}</span>
      </div>
      <div class="acciones">
        <button class="borrar">Borrar</button>
        <button class="editar">Editar</button>
      </div>
    `;

    /* Borrar contacto */
    div.querySelector('.borrar').onclick = () => {
      contactos = contactos.filter(x => x.id !== c.id); // Quita contacto
      guardar(); render(contactos); actualizarTotal(); // Guarda y actualiza
    };

    /* Editar contacto */
    div.querySelector('.editar').onclick = () => {
      ['nombre','telefono','email','etiquetas'].forEach(id => 
        document.getElementById(id).value = c[id] // Pone los datos en el formulario
      );
      contactos = contactos.filter(x => x.id !== c.id); // Quita temporalmente
      guardar(); render(contactos); actualizarTotal(); // Guarda y actualiza
    };

    lista.appendChild(div); // Añade al HTML
  });

  actualizarTotal(); // Actualiza total
}

/* --- ACTUALIZAR TOTAL --- */
function actualizarTotal() { 
  totalEl.textContent = contactos.length; // Muestra total
}

/* --- FORMULARIO --- */
form.onsubmit = e => {
  e.preventDefault(); // Evita recargar
  const nombre = document.getElementById('nombre').value.trim();
  const telefono = document.getElementById('telefono').value.trim();
  const email = document.getElementById('email').value.trim();
  const etiquetas = document.getElementById('etiquetas').value.trim();

  /* Validar campos */
  if(!nombre || !telefono || !email){ 
    mensaje.textContent='Completa todos los campos'; mensaje.style.color='red'; return;
  }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ 
    mensaje.textContent='Email no válido'; mensaje.style.color='red'; return;
  }

  /* Añadir contacto */
  contactos.push({ id: Date.now(), nombre, telefono, email, etiquetas });
  guardar(); render(contactos); 
  mensaje.textContent='Contacto añadido'; mensaje.style.color='green';
  form.reset(); // Limpia formulario
};

/* --- BÚSQUEDA --- */
busqueda.oninput = () => {
  const q = busqueda.value.toLowerCase(); // Busca lo que escriba el usuario
  render(contactos.filter(c => 
    c.nombre.toLowerCase().includes(q) || 
    c.email.toLowerCase().includes(q) || 
    c.etiquetas.toLowerCase().includes(q)
  ));
};
