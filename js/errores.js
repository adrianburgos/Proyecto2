var errores = [];
var contErrores = 0;
var htmlErrores = "";
/* estructura de un error
	{
		tipo: "semantico - sintactico - lexico - en ejecucion"
		descripcion: "detalle del error"
		fila: "detalle del error"
		columna: "detalle del error"
	}
*/
function agregarError(er) {
	errores.push(er);
	contErrores++;
}

function generarErrores(){
	htmlErrores = "";
	getErrores(errores);
}

function getErrores() {
	for (var i = 0; i < errores.length; i++) {
		htmlErrores += "<tr>";
		htmlErrores += "<td> " + errores[i].tipo +" </td>" +
		"<td>" + errores[i].descripcion + "</td>" +
		"<td>" + errores[i].fila + "</td>" +
		"<td>" + errores[i].columna + "</td>";
		htmlErrores += "</tr>\n";
	}
}
