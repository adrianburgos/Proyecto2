var tabla = [];
/*{
	nombre: id,
	ambito: global,
	pos: x,
	tipo: x,
	tam: x,
	dim: {obj JSON},
	rol: "value"
	}
	este sera un objeto dentro de la tabla de simbolos
	*/
function crearTabla(raiz) {
	var pos = 0;
	for (var i = 0; i < raiz.hijos.length; i++) {
		switch(raiz.hijos[i].nombre)
		{
			case "DECVAR":
				var decvar = raiz.hijos[i];
				var tipo = getTipo(decvar.tipo);
				var lvariables = decvar.hijos[0];
				for (var variable in lvariables.hijos) {
					var dec = {
						nombre : variable,
						ambito : ambito,
						pos : pos,
						tipo : tipo,

					};
				}
				break
		}
	}
}
