/* ============================================================
   app.js — Lógica del Frontend (consumo de la API con fetch)
   ============================================================
   Este archivo se comunica con el backend Express desplegado
   en Render: https://agenda-supabase.onrender.com/api/contactos

   Funcionalidades:
   - Cargar y pintar la lista de contactos.
   - Enviar el formulario para crear un contacto (POST).
   - Editar un contacto existente (PUT).
   - Eliminar un contacto (DELETE).
   ============================================================ */

// ---------- 1. URL base de la API (backend en Render) ----------
const API_URL = "https://agenda-supabase.onrender.com/api/contactos";

// ---------- 2. Referencias a los elementos del HTML ----------
const formulario = document.getElementById("formulario-contacto");
const campoNombre = document.getElementById("nombre");
const campoTelefono = document.getElementById("telefono");
const listaContactos = document.getElementById("lista-contactos");
const estado = document.getElementById("estado");
const tituloFormulario = document.getElementById("titulo-formulario");
const btnGuardar = document.getElementById("btn-guardar");
const btnCancelar = document.getElementById("btn-cancelar");

// Variable que guarda el id del contacto que estamos editando (null = modo crear)
let contactoEditando = null;

// ---------- 3. Funciones de apoyo ----------

// Muestra un mensaje en la zona de "estado"
function mostrarEstado(mensaje) {
  estado.textContent = mensaje;
}

// Limpia los campos del formulario y vuelve al modo "crear"
function resetearFormulario() {
  formulario.reset();
  contactoEditando = null;
  tituloFormulario.textContent = "➕ Nuevo contacto";
  btnGuardar.textContent = "Guardar";
  btnCancelar.classList.add("oculto"); // Ocultamos el botón "Cancelar edición"
}

// ---------- 4. Obtener y pintar los contactos ----------

// Función asíncrona que hace GET a la API y renderiza la lista
async function cargarContactos() {
  try {
    mostrarEstado("Cargando contactos…");

    // Hacemos la petición GET a la API
    const respuesta = await fetch(API_URL);

    // Si la respuesta no es correcta (p. ej. 500), lanzamos un error
    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    // Convertimos la respuesta a JSON (un array de contactos)
    const contactos = await respuesta.json();

    pintarContactos(contactos);
  } catch (error) {
    // Puede ser un error de red (backend apagado) o una respuesta 500
    // (backend encendido pero base de datos mal configurada)
    mostrarEstado(
      "⚠️ No se pudieron cargar los contactos. Revisa que el backend esté en marcha en Render y que la base de datos esté bien configurada en el archivo .env"
    );
    console.error("Error al cargar contactos:", error);
  }
}

// Recibe el array de contactos y dibuja cada uno en la lista
function pintarContactos(contactos) {
  // Vaciamos la lista antes de volver a pintar
  listaContactos.innerHTML = "";

  // Si no hay contactos, mostramos un mensaje
  if (contactos.length === 0) {
    mostrarEstado("No hay contactos todavía. ¡Añade el primero! 🎉");
    return;
  }

  // Ocultamos el mensaje de estado cuando hay registros
  estado.textContent = "";

  // Recorremos cada contacto y lo añadimos a la lista
  contactos.forEach((contacto) => {
    const item = document.createElement("li");
    item.className = "item-contacto";

    // Contenedor con la información del contacto
    const info = document.createElement("div");
    info.className = "info-contacto";

    const nombre = document.createElement("span");
    nombre.className = "nombre";
    nombre.textContent = contacto.nombre;

    const telefono = document.createElement("span");
    telefono.className = "telefono";
    telefono.textContent = contacto.telefono || "Sin teléfono";

    info.appendChild(nombre);
    info.appendChild(telefono);

    // Contenedor con los botones de acción
    const acciones = document.createElement("div");
    acciones.className = "acciones-contacto";

    // Botón "Editar" -> rellena el formulario con los datos del contacto
    const btnEditar = document.createElement("button");
    btnEditar.className = "btn btn-editar btn-pequeno";
    btnEditar.textContent = "Editar";
    btnEditar.addEventListener("click", () => prepararEdicion(contacto));

    // Botón "Eliminar" -> borra el contacto tras confirmar
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn btn-eliminar btn-pequeno";
    btnEliminar.textContent = "Eliminar";
    btnEliminar.addEventListener("click", () => eliminarContacto(contacto.id));

    acciones.appendChild(btnEditar);
    acciones.appendChild(btnEliminar);

    item.appendChild(info);
    item.appendChild(acciones);

    listaContactos.appendChild(item);
  });
}

// ---------- 5. Crear un contacto (POST) ----------
async function crearContacto(datos) {
  try {
    // Enviamos la petición POST con el cuerpo en JSON
    const respuesta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    // Recargamos la lista para mostrar el nuevo contacto
    await cargarContactos();
  } catch (error) {
    console.error("Error al crear contacto:", error);
    mostrarEstado("⚠️ No se pudo guardar el contacto.");
  }
}

// ---------- 6. Actualizar un contacto (PUT) ----------
async function actualizarContacto(id, datos) {
  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    // Recargamos la lista y volvemos al modo "crear"
    await cargarContactos();
    resetearFormulario();
  } catch (error) {
    console.error("Error al actualizar contacto:", error);
    mostrarEstado("⚠️ No se pudo actualizar el contacto.");
  }
}

// ---------- 7. Eliminar un contacto (DELETE) ----------
async function eliminarContacto(id) {
  // Confirmamos con el usuario antes de borrar
  const confirmado = confirm("¿Seguro que quieres eliminar este contacto?");
  if (!confirmado) return;

  try {
    const respuesta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!respuesta.ok) {
      throw new Error(`Error del servidor: ${respuesta.status}`);
    }

    // Recargamos la lista sin el contacto eliminado
    await cargarContactos();
  } catch (error) {
    console.error("Error al eliminar contacto:", error);
    mostrarEstado("⚠️ No se pudo eliminar el contacto.");
  }
}

// ---------- 8. Preparar la edición de un contacto ----------
function prepararEdicion(contacto) {
  // Rellenamos el formulario con los datos del contacto a editar
  campoNombre.value = contacto.nombre;
  campoTelefono.value = contacto.telefono || "";

  // Guardamos el id del contacto en edición
  contactoEditando = contacto.id;

  // Cambiamos el texto de los botones para reflejar el modo edición
  tituloFormulario.textContent = "✏️ Editando contacto";
  btnGuardar.textContent = "Actualizar";
  btnCancelar.classList.remove("oculto"); // Mostramos "Cancelar edición"

  // Llevamos el foco al campo nombre para editar rápido
  campoNombre.focus();
}

// ---------- 9. Evento de envío del formulario ----------
formulario.addEventListener("submit", async (evento) => {
  // Evitamos que la página se recargue al enviar el formulario
  evento.preventDefault();

  // Recogemos los datos del formulario
  const datos = {
    nombre: campoNombre.value.trim(),
    telefono: campoTelefono.value.trim(),
  };

  // Si estamos editando un contacto, hacemos PUT; si no, POST
  if (contactoEditando !== null) {
    await actualizarContacto(contactoEditando, datos);
  } else {
    await crearContacto(datos);
    resetearFormulario();
  }
});

// ---------- 10. Botón "Cancelar edición" ----------
btnCancelar.addEventListener("click", resetearFormulario);

// ---------- 11. Al cargar la página, obtenemos los contactos ----------
cargarContactos();
