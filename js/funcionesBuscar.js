function buscarVariable(id) {
  var encontrado = false;
  var amb;
  var contAmb = ambito.length;
  var tamTotal = 0;
  var t = "p";
  while (!encontrado && contAmb !== 0) {
    //ambito a buscar
    amb = "global";
    for (var i = 1; i < contAmb; i++) {
      amb += "#" + ambito[i];
    }
    var objAmbito = buscarAmbito(tabla[0], amb);
    amb = "global";
    for (i = 1; i < contAmb - 1; i++) {
      amb += "#" + ambito[i];
    }
    var ambitoPadre = buscarAmbito(tabla[0], amb);
    //se busca dentro de todas las variables
    for (i = 0; i < objAmbito.variables.length; i++) {
      var variable = objAmbito.variables[i];
      if(id === variable.nombre)
        return { variable : variable, temp : t };
    }
    tamTotal += ambitoPadre.tam;
    t = getTemp();
    agregar3d(t + " = p - " + tamTotal + " ;");
    contAmb--;
  }
  return null;
}

function buscarVariableEnAmbito(amb, id) {
  for (var i = 0; i < amb.variables.length; i++) {
    if(amb.variables[i].nombre === id)
      return amb.variables[i];
  }
  return null;
}

function buscarPrincipal(raiz) {
  for (var i = 0; i < raiz.hijos.length; i++) {
    if(raiz.hijos[i].nombre === "PRINCIPAL")
      return raiz.hijos[i];
  }
  return null;
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
//buscar el cuerpo dentro de una sentencia
function buscarCuerpo(sentencia) {
	for (var i = 0; i < sentencia.hijos.length; i++)
		if (sentencia.hijos[i].nombre === "LCUERPO")
			return sentencia.hijos[i];
}

function buscarAtributo(element, nombre) {
  for (var i = 0; i < element.variables.length; i++) {
    if(element.variables[i].nombre === nombre)
      return element.variables[i];
  }
  return null;
}

function buscarFuncionTS(nombre) {
  nombre = "global#" + nombre;
  for (var i = 0; i < tabla[0].ambitos.length; i++) {
    var actual = tabla[0].ambitos[i];
    if(actual.nombre === nombre)
      return actual;
  }
  return null;
}
