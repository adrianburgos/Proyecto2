var tabla = [];
var ambito = ["global"];
var contAmb = 0;
/*Estructura de un ambito
	{
		nombre: id,
		variables: [],
		ambitos: [],
		tipo: num,
		tam: num
	}
	*/
/*Estructura de una variable
	{
		nombre: id,
		ambito: "ambito",
		pos: num,
		tipo: num,
		tam: num,
		rol: "rol",
		dim: {obxj JSON}
	}
	*/
function crearTabla(raiz, pos) {
	for (var i = 0; i < raiz.hijos.length; i++) {
		switch(raiz.hijos[i].nombre)
		{
			case "DECVAR":
				var decvar = raiz.hijos[i];
				var tipo = getTipo(decvar.tipo);
				var lvariables = decvar.hijos[0];
				for (var j = 0; j < lvariables.hijos.length; j++) {
					declararVariable(lvariables.hijos[j], getAmbito(), pos, tipo, 1, "variable", null);
					pos++;
				}
				break;
			case "ARRAY":
				var arr = raiz.hijos[i];
				tipo = getTipo(arr.tipo);
				var lcorchetes = arr.hijos[0];
				var tamArr = calcularTamArr(lcorchetes);
				if (tamArr !== 0) {
					declararVariable(arr.id, getAmbito(), pos, tipo, 1, "arreglo", lcorchetes);
					pos++;
				}
				else {
					var err = {
						tipo: "Semantico",
						descripcion: "Las dimensiones del arreglo [" + arr.id + "] no son correctas",
						fila: 0,
						columna: 0
					};
					agregarError(err);
				}
				break;
			case "FUNCION":
				var ambGlobal = buscarAmbito(tabla[0], "global");
				var decfun = raiz.hijos[i];
				var lpar = decfun.hijos[0];
				var lcuerpo = decfun.hijos[1];
				tipo = getTipo(decfun.tipo);
				//se crea el ambito correspondiente a la funcion
				var ambFun = crearAmbito("global#" + decfun.id, tipo);
				ambGlobal.ambitos.push(ambFun);
				ambito.push(decfun.id);
				//se agrega el retorno como primera posicion de la funcion
				var dim = null;
				if(decfun.hijos.length === 3)
				{//se verifica que ningun corchete tenga valores
					var L = decfun.hijos[2];
					var estaBien = true;
					for (j = 0; j < L.hijos.length; j++)
						if(L.hijos[j].hijos.length !== 0)
							estaBien = false;
					if (estaBien)
						dim = L;
					else {
						var err2 = {
							tipo: "Semantico",
							descripcion: "La funcion [" + decfun.id + "] no fue declarada correctamente, " +
							"no debe de tener rangos",
							fila: 0,
							columna: 0
						};
						agregarError(err2);
					}
				}
				declararVariable("return", getAmbito(), 0, tipo, 1, "retorno", dim);
				//se agregan los parametros como variables de la funcion
				var posFun = 1;
				for(j = 0; j < lpar.hijos.length; j++)
				{
					var dim2 = null;
					if (lpar.hijos[j].hijos.length > 0)
						dim2 = lpar.hijos[j].hijos[0];
						declararVariable(lpar.hijos[j].valor, getAmbito(), j+1, getTipo(lpar.hijos[j].tipo), 1, "parametro", dim2);
					posFun++;
				}
				var tam = crearTabla(lcuerpo, posFun);
				ambFun.tam = tam;
				ambito.pop();
				break;
			case "PRINCIPAL":
				ambGlobal = buscarAmbito(tabla[0], "global");
				decfun = raiz.hijos[i];
				lcuerpo = decfun.hijos[0];
				tipo = getTipo("void");
				//se crea el ambito correspondiente a la funcion
				ambFun = crearAmbito("global#" + decfun.nombre, tipo);
				ambGlobal.ambitos.push(ambFun);
				ambito.push(decfun.nombre);
				tam = crearTabla(lcuerpo, 0);
				ambFun.tam = tam;
				ambito.pop();
				break;
			case "SI":
			case "MIENTRAS":
			case "HACER":
			case "REPETIR":
			case "PARA":
			case "LOOP":
			case "CONTAR":
			case "HACERX":

				var sent = raiz.hijos[i];
				lcuerpo = buscarCuerpo(sent);
				var ambActual = buscarAmbito(tabla[0], getAmbito());
				tipo = -1;// tipo para las sentencia
				//se crea el ambito correspondiente a la sentencia
				var nombreAmbSent = ambito.join("#") + "#" + sent.nombre + contAmb;
				var ambSent = crearAmbito(nombreAmbSent, tipo);
				ambActual.ambitos.push(ambSent);
				ambito.push(sent.nombre + contAmb);
				contAmb++;
				var posSent = 0;
				if(sent.nombre === Const.PARA && sent.hijos[0].nombre === "DECVAR")
				{
					declararVariable(sent.hijos[0].hijos[0].hijos[0], getAmbito(), 0, getTipo(Const.num), 1, "variable", null);
					posSent++;
				}
				ambSent.tam = crearTabla(lcuerpo, posSent);
				ambito.pop();
				if(sent.nombre === Const.SI && sent.hijos.length === 3)
				{//El SI tiene instruccion ELSE
					//cuerpo del else
					lcuerpo = sent.hijos[2];
					ambActual = buscarAmbito(tabla[0], getAmbito());
					tipo = -1;// tipo para las sentencia
					//se crea el ambito correspondiente a la sentencia
					nombreAmbSent = ambito.join("#") + "#ELSE" + contAmb;
					ambSent = crearAmbito(nombreAmbSent, tipo);
					ambActual.ambitos.push(ambSent);
					ambito.push("ELSE" + contAmb);
					contAmb++;
					ambSent.tam = crearTabla(lcuerpo, 0);
					ambito.pop();
				}
				break;
			case "SELECCION":
				//TODO: creacion de la tabla de simbolos para la sentencia SELECCION
				break;
		}
	}
	return pos;
}

function declararVariable(id, ambito, pos, tipo, tam, rol, dim) {
		var dec = {
			nombre : id,
			ambito : ambito,
			pos : pos,
			tam : tam,
			tipo : tipo,
			rol : rol,
			dim: dim
		};
		var amb = buscarAmbito(tabla[0], getAmbito());
		if(amb !== null)
		{
			//TODO: verificar que la variable no este declarada
			amb.variables.push(dec);
		}
}

function getAmbito() {
	return ambito.join("#");
}

function crearAmbito(nombre, tipo) {
	return {nombre: nombre, variables: [], ambitos: [], tipo: tipo, tam: 0};
}

function buscarAmbito(amb, nombre) {
	var ret = null;
	if(amb.nombre === nombre)
		return amb;
	for (var i = 0; i < amb.ambitos.length; i++)
	{
		ret = buscarAmbito(amb.ambitos[i], nombre);
		if(ret !== null)
			return ret;
	}
	return ret;
}

function calcularTamArr(lcorchetes) {
	var tamArr = 1;
	for(var x = 0; x < lcorchetes.hijos.length; x++)
	{
		var rango = lcorchetes.hijos[x];
		if(rango.hijos.length !== 0)
		{
			var inicio = Number(rango.hijos[0]);
			var fin = Number(rango.hijos[1]);
			tamArr = tamArr * (fin - inicio);
		}
		else
			tamArr = 0;
	}
	return tamArr;
}

function buscarCuerpo(sentencia) {
	for (var i = 0; i < sentencia.hijos.length; i++)
		if (sentencia.hijos[i].nombre === "LCUERPO")
			return sentencia.hijos[i];
}

var htmlTabla = "";
function generarTabla(){
	htmlTabla = "";
	getTabla(tabla[0]);
}
function getTabla(ambito) {
	var amb = ambito.nombre.split("#");
	var ambCompleto = "<ol class='breadcrumb'> <li> global </li>";
	for (var x = 1; x < amb.length - 1; x++){
		ambCompleto += "<li>" + amb[x] + "</li>";
	}
	ambCompleto += "</ol>";
	var amb2 = ambito.nombre.split("#");
	var ambCompleto2 = "<ol class='breadcrumb'> <li> global </li>";
	for (x = 1; x < amb2.length; x++){
		ambCompleto2 += "<li>" + amb2[x] + "</li>";
	}
	ambCompleto2 += "</ol>";
	htmlTabla += "<tr>" +
		"<td class = 'success'> Ambito </td>" +
		"<td>" + ambCompleto2 + "</td>" +
		"<td>" + ambCompleto + "</td>" +
		"<td> --- </td>" +
		"<td>" + getTipo(ambito.tipo) + "</td>" +
		"<td>" + ambito.tam + "</td>" +
		"<td> --- </td>" +
		//TODO: si existen dimensiones hay que agregarlas
		"</tr>\n";
	for (var i = 0; i < ambito.variables.length; i++) {
		htmlTabla += "<tr>";
		if(ambito.variables[i].rol === "retorno")
			htmlTabla +=	"<td class = 'danger'>" + ambito.variables[i].rol + "</td>";
		else if(ambito.variables[i].rol === "parametro")
			htmlTabla +=	"<td class = 'warning'>" + ambito.variables[i].rol + "</td>";
		else
			htmlTabla +=	"<td class = 'info'>" + ambito.variables[i].rol + "</td>";
		amb = ambito.variables[i].ambito.split("#");
		ambCompleto = "<ol class='breadcrumb'> <li> global </li>";
		for (x = 1; x < amb.length; x++){
			ambCompleto += "<li>" + amb[x] + "</li>";
		}
		ambCompleto += "</ol>";
		htmlTabla += "<td>" + ambito.variables[i].nombre + "</td>" +
			"<td>" + ambCompleto + "</td>" +
			"<td>" + ambito.variables[i].pos + "</td>" +
			"<td>" + getTipo(ambito.variables[i].tipo) + "</td>" +
			"<td>" + ambito.variables[i].tam + "</td>" +
			"<td> --- </td>" +
			//TODO: si existen dimensiones hay que agregarlas
			"</tr>\n";
	}
	for (var j = 0; j < ambito.ambitos.length; j++) {
		getTabla(ambito.ambitos[j]);
	}
}
