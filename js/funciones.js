import Citas from "./class/Citas.js";
import UI from "./class/UI.js";
import {
    mascotaInput,
    propietarioInput,
    telefonoInput,
    fechaInput,
    horaInput,
    sintomasInput,
    formulario,
} from "./selectores.js";

//Instancia las clases.
const ui = new UI();
const administrarCitas = new Citas();

let editando = false; //Bandera para verificar si esta editado.

const citaObj = {
    mascota: "",
    propietario: "",
    telefono: "",
    fecha: "",
    hora: "",
    sintomas: "",
};

//Funciones.
export function datosCita(e) {
    citaObj[e.target.name] = e.target.value;
}

export function nuevaCita(e) {
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
        const btnSubmit = formulario.querySelector('button[type="submit"]');
        btnSubmit.textContent = "Crear Cita";
        btnSubmit.classList.remove("btn-info");
        btnSubmit.classList.add("btn-success");

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

export function reiniciarObj() {
    citaObj.mascota = "";
    citaObj.propietario = "";
    citaObj.telefono = "";
    citaObj.fecha = "";
    citaObj.hora = "";
    citaObj.sintomas = "";
}

export function eliminarCita(id) {
    //Elimina la cita
    administrarCitas.eliminarCita(id);

    //Muestra un mensaje.
    ui.imprimirAlerta("La cita se eliminó correctamente");

    //Refresca la cita.
    ui.imprimirCitas(administrarCitas);
}

//Carga los datos para el  modo edicion.
export function cargarEdicion(cita) {
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
