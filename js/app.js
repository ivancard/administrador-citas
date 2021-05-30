//Variables formulario.
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

//Variables UI
const contenedorCitas = document.querySelector("#citas");
const formulario = document.querySelector("#nueva-cita");

formulario.addEventListener("submit", nuevaCita);

let editando = false; //Bandera para verificar si esta editado.

//Inicia los eventos.
eventListeners();
function eventListeners() {
    mascotaInput.addEventListener("input", datosCita);
    propietarioInput.addEventListener("input", datosCita);
    telefonoInput.addEventListener("input", datosCita);
    fechaInput.addEventListener("input", datosCita);
    horaInput.addEventListener("input", datosCita);
    sintomasInput.addEventListener("input", datosCita);
}

const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
};

//Funciones
function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

//Clases.
class Citas {
    constructor() {
        this.citas = [];
    }

    agregarCita(cita) {
        this.citas = [...this.citas, cita];
    }
    eliminarCita(id) {
        this.citas = this.citas.filter((cita) => cita.id !== id);
    }

    editarCita(citaActualizada) {
        this.citas = this.citas.map((cita) =>
            cita.id === citaActualizada.id ? citaActualizada : cita
        );
    }
}

class UI {
    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement("div");
        divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

        //Agregar clase segun su tipo de error.
        if (tipo === "error") {
            divMensaje.classList.add("alert-danger");
        } else {
            divMensaje.classList.add("alert-success");
        }

        //Asigna el mensaje.
        divMensaje.textContent = mensaje;

        //Agrega al DOM.
        document
            .querySelector("#contenido")
            .insertBefore(divMensaje, document.querySelector(".agregar-cita"));

        //Quitar la alerta.
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    imprimirCitas({ citas }) {
        this.limpiarHTML();
        citas.forEach((cita) => {
            const {
                mascota,
                propietario,
                telefono,
                fecha,
                hora,
                sintomas,
                id,
            } = cita;

            const divCita = document.createElement("div");
            divCita.classList.add("cita", "p-3");
            divCita.dataset.id = id;

            //Script cita
            const mascotaParrafo = document.createElement("h2");
            mascotaParrafo.classList.add("card-title", "font-weight-bolder");
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement("p");
            propietarioParrafo.innerHTML = `
            <span class = "font-weight-bolder">Propietario: </span> ${propietario}
            `;

            const telefonoParrafo = document.createElement("p");
            telefonoParrafo.innerHTML = `
            <span class = "font-weight-bolder">Telefono: </span> ${telefono}
            `;

            const fechaParrafo = document.createElement("p");
            fechaParrafo.innerHTML = `
            <span class = "font-weight-bolder">Fecha: </span> ${fecha}
            `;

            const horaParrafo = document.createElement("p");
            horaParrafo.innerHTML = `
            <span class = "font-weight-bolder">Hora: </span> ${hora}
            `;

            const sintomasParrafo = document.createElement("p");
            sintomasParrafo.innerHTML = `
            <span class = "font-weight-bolder">Sintomas: </span> ${sintomas}
            `;

            //Boton para eliminar citas.
            const btnEliminar = document.createElement("button");
            btnEliminar.classList.add("btn", "btn-danger", "mr-2");
            btnEliminar.onclick = () => eliminarCita(id); // añade la opción de eliminar
            btnEliminar.innerHTML = `Eliminar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;

            //Añade ub boton para editar.
            const btnEdit = document.createElement("button");
            btnEdit.classList.add("btn", "btn-info", "mr-2");
            btnEdit.innerHTML = `
                Editar <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>`;
            btnEdit.onclick = () => cargarEdicion(cita);

            //Agregar texto al div.
            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEdit);

            //Agregar el div al DOM
            contenedorCitas.appendChild(divCita);
        });
    }
    limpiarHTML() {
        while (contenedorCitas.firstChild) {
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }
}

//Instancia las clases.
const ui = new UI();
const administrarCitas = new Citas();

function nuevaCita(e) {
    e.preventDefault();
    const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;
    //Valida las citas.
    if (
        mascota === "" ||
        propietario === "" ||
        telefono === "" ||
        fecha === "" ||
        hora === "" ||
        sintomas === ""
    ) {
        ui.imprimirAlerta("Todos los campos son obligatorios", "error");
        return;
    }
    if (editando) {
        ui.imprimirAlerta("Editado correctamente");

        //Pasar el objeto de la cita a edicion.
        administrarCitas.editarCita({ ...citaObj });

        //Volver al estado anterior el boton.
        formulario.querySelector('button[type="submit"]').textContent =
            "Crear Cita";
        editando = false; // Desactiva la badera de edicion.
    } else {
        //Asigna ID unico a cada cita
        citaObj.id = Date.now();
        administrarCitas.agregarCita({ ...citaObj }); //Se le pasa una copia del objeto.
        ui.imprimirAlerta("Cita registrada.");
    }

    ui.imprimirCitas(administrarCitas);

    reiniciarObj();

    formulario.reset(); //Refresh Form

    //mostrar citasen el dom.
}

function reiniciarObj() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

function eliminarCita(id) {
    //Elimina la cita
    administrarCitas.eliminarCita(id);

    //Muestra un mensaje.
    ui.imprimirAlerta("La cita se eliminó correctamente");

    //Refresca la cita.
    ui.imprimirCitas(administrarCitas);
}

//Carga los datos para el  modo edicion.
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita;

    //Reiniciar el objeto.
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    //Pasar datos a los inputs.
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //cambiar texto del boton del formulario.
    const btnSubmit = formulario.querySelector('button[type="submit"]');
    btnSubmit.classList.remove("btn-success");
    btnSubmit.classList.add("btn-info");
    btnSubmit.textContent = "Guardar cambios";

    editando = true;
}
