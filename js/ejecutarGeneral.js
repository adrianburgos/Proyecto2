function ejecutarArbolGeneral(raiz) {
  agregar3d("void init#global(){");
  var ambGlobal = buscarAmbito(tabla[0], "global");
  agregar3dTOT("h", "h", ambGlobal.tam, "+");
  for (var ii = 0; ii < raiz.hijos.length; ii++) {
    var hijoGlobal = raiz.hijos[ii];
    switch (hijoGlobal.nombre) {
      case Const.DECVAR:
        decVariable(hijoGlobal);
        break;
    }
  }
  agregar3d("}");
  for (var i = 0; i < raiz.hijos.length; i++) {
    var hijo = raiz.hijos[i];
    switch (hijo.nombre) {
      case Const.PRINCIPAL:
        agregar3d("//==================================");
        ambito.push(Const.PRINCIPAL);
        var ambPrin = buscarAmbito(tabla[0], ambito.join("#"));
        agregar3d("void Principal(){");
        agregar3dTOT("p", "p", ambPrin.tam, "+");
        agregar3d("init#global() ;");
        agregar3dTOT("p", "p", ambPrin.tam, "-");
        ejecutarArbol(hijo.hijos[0]);
        agregar3d("}");
        ambito.pop();
        break;
      case Const.ELEMENT:
        var LCUERPOELE = hijo.hijos[0];
        ambito.push(hijo.id);
        var temp = getTemp();
        var amb = buscarAmbito(tabla[0], ambito.join("#"));
        agregar3d("void init#" + ambito.join("#") + "(){");
        agregar3d(temp + " = h ;");
        agregar3d("h = h + " + amb.tam + " ;");
        for (var j = 0; j < LCUERPOELE.hijos.length; j++) {
          var decvar = LCUERPOELE.hijos[j];
          if(decvar.nombre === Const.DECVAR){
            var val = evaluarValor(decvar.hijos[1]);
            var LVARIABLES = decvar.hijos[0];
            for (var jj = 0; jj < LVARIABLES.hijos.length; jj++) {
              var id = LVARIABLES.hijos[jj].hijos[0];
              var variable = buscarVariableEnAmbito(amb, id);
              var tempVar = getTemp();
              agregar3d("//declaracion de la variable [" + id + "] dentro de init#" + ambito.join("#"));
              agregar3d(tempVar + " = " + temp + " + " + variable.pos + " ;");
              agregar3d("heap [ " + tempVar + " ] = " + val.temp + " ;");
            }
          }
        }
        var tempRet = getTemp();
        agregar3d(tempRet + " = p + 0 ;");
        agregar3d("stack [ " + tempRet + " ] = " + temp + " ;");
        agregar3d("}");
        for (var k = 0; k < LCUERPOELE.hijos.length; k++) {
          if(LCUERPOELE.hijos[k].nombre === Const.ELEMENT){
              ejecutarArbolGeneral({hijos:[LCUERPOELE.hijos[k]]});
          }
        }
        ambito.pop();
        break;
      case Const.FUNCION:
        agregar3d("//==================================");
        var funcion = buscarFuncionTS(hijo.id);
        objDisplay = {
          retorno: false,
          nombre: hijo.id,
          id: "",
          lsalida: getEtq(),
          lsig: "",
          tam: 0,
          tipo: funcion.tipo,
          tipoElemento: funcion.tipoElemento
        };
        display.push(objDisplay);
        ambito.push(hijo.id);
        agregar3d("void " + hijo.id + "(){");
        var cuerpo = buscarCuerpo(hijo);
        ejecutarArbol(cuerpo);
        objDisplay = display.pop();
        if(objDisplay.tipo !== Const.tvoid && !objDisplay.retorno){
          agregar3d("exit ( 243 ) ;");
        }
        agregar3dEtq(objDisplay.lsalida);
        agregar3d("}");
        ambito.pop();
        break;
      default:

    }
  }
}
