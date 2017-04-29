var errores = [];
var contErrores = 0;
/* estructura de un error
	{
		tipo: "semantico - sintactico - lexico - en ejecucion"
		descripcion: "detalle del error"
	}
*/
function agregarError(er) {
	errores.push(er);
	contErrores++;
}
