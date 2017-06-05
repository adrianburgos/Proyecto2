var contAmbActual = 0;
var display = [];

function ejecutarArbol(cuerpo) {
  console.log("ejecutarArbol");
  console.log(cuerpo);
  for (var i = 0; i < cuerpo.hijos.length; i++) {
    console.log(cuerpo.hijos[i]);
    var sent = cuerpo.hijos[i];
    var l = "";
    var er;
    switch(sent.nombre)
    {
      case Const.ASIGNACION:
        asignarVariable(sent);
        break;
      case Const.DECVAR:
        decVariable(sent);
        break;
      case Const.SI:
        var ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        agregar3d("//cambio de ambito para el if");
        agregar3d("p = p + " + ambActual.tam + " ;");
        var lcuerpo = sent.hijos[1];
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se evalua la condicion del if
        var val = evaluarValor(sent.hijos[0]);
        //si es de tipo bool (7) todo esta bien
        if(val.tipo === Const.tbool)
        {//se procede a colocar las etiquetas de verdad y falso en su lugar
          agregar3d("//etiquetas de verdad del if");
          agregar3d(val.lv.join(" :\n") + " :");
          ejecutarArbol(lcuerpo);
          if (sent.hijos.length === 3) {//posee un ELSE
            ambito.pop();
            ambito.push("ELSE" + contAmbActual);
            contAmbActual++;
            l = getEtq();
            agregar3d("//salto para no ejecutar el ELSE");
            agregar3d("goto " + l + " ;");
            lcuerpo = sent.hijos[2];
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(" :\n") + " :");
            ejecutarArbol(lcuerpo);
            agregar3d("//salida de las instrucciones de verdadero");
            agregar3d(l + " :");
            ambito.pop();
          }
          else {
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(" :\n") + " :");
            ambito.pop();
          }
          agregar3d("//regreso de ambito para el if");
          agregar3d("p = p - " + ambActual.tam + " ;");
          disminuirDisplay(ambActual.tam);
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La condicion del if-then no es valida",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          ambito.pop();
        }
        break;
      case Const.MIENTRAS:
        //TODO: verificar sentencias de escape con DISPLAY dentro de ciclos
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        var objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: "",
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el while");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del while");
        agregar3d(l + " :");
        val = evaluarValor(sent.hijos[0]);
        if(val.tipo === Const.tbool)
        {
          agregar3d("//etiquetas de verdadero del while");
          agregar3d(val.lv.join(" :\n") + " :");
          lcuerpo = sent.hijos[1];
          ejecutarArbol(lcuerpo);
          agregar3d("//etiqueta de siguiente del while");
          agregar3dEtq(objDisplay.lsig);
          agregar3d("//salto a etiqueta de inicio del while");
          agregar3d("goto " + l + " ;");
          agregar3d("//etiquetas de falso del while");
          agregar3d(val.lf.join(" :\n") + " :");
          agregar3d("//etiqueta de salida del while");
          agregar3dEtq(objDisplay.lsalida);
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La condicion del while no es valida",
						fila: 0,
						columna: 0
          };
          agregarError(er);
        }
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el while");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.HACER:
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: "",
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el do-while");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del do-while");
        agregar3d(l + " :");
        lcuerpo = sent.hijos[0];
        ejecutarArbol(lcuerpo);
        val = evaluarValor(sent.hijos[1]);
        if(val.tipo === Const.tbool)
        {
          agregar3d("//etiquetas de verdadero del do-while");
          agregar3d(val.lv.join(" :\n") + " :");
          agregar3d("//etiqueta de siguiente del do-while");
          agregar3dEtq(objDisplay.lsig);
          agregar3d("//salto a etiqueta de inicio del do-while");
          agregar3dGoto(l);
          agregar3d("//etiquetas de falso del do-while");
          agregar3d(val.lf.join(" :\n") + " :");
          agregar3d("//etiqueta de salida del do-while");
          agregar3dEtq(objDisplay.lsalida);
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La condicion del do-while no es valida",
            fila: 0,
            columna: 0
          };
          agregarError(er);
        }
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el do-while");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.REPETIR:
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: "",
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el repeat-until");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del repeat-until");
        agregar3d(l + " :");
        lcuerpo = sent.hijos[0];
        ejecutarArbol(lcuerpo);
        val = evaluarValor(sent.hijos[1]);
        if(val.tipo === Const.tbool)
        {
          agregar3d("//etiquetas de falso del repeat-until");
          agregar3d(val.lf.join(" :\n") + " :");
          agregar3d("//etiqueta de siguiente del repeat-until");
          agregar3dEtq(objDisplay.lsig);
          agregar3d("//salto a etiqueta de inicio del repeat-until");
          agregar3d("goto " + l + " ;");
          agregar3d("//etiquetas de verdadero del repeat-until");
          agregar3d(val.lv.join(" :\n") + " :");
          agregar3d("//etiqueta de salida del repeat-until");
          agregar3dEtq(objDisplay.lsalida);
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La condicion del repeat-until no es valida",
            fila: 0,
            columna: 0
          };
          agregarError(er);
        }
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el repeat-until");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.PARA:
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: "",
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el for");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se realiza la asignacion a la variable de control
        agregar3d("//asignacion a la variable de control del for");
        if(sent.hijos[0].nombre === Const.DECVAR)
          decVariable(sent.hijos[0]);
        else
          asignarVariable(sent.hijos[0]);
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del for");
        agregar3d(l + " :");
        //se evalua la condicion del for
        val = evaluarValor(sent.hijos[1]);
        if(val.tipo === Const.tbool)
        {//si la condicion es de tipo bool(7) se ejecuta su cuerpo
          agregar3d("//etiquetas de verdadero del for");
          agregar3d(val.lv.join(" :\n") + " :");
          agregar3d("//se ejecuta el cuerpo del for");
          lcuerpo = sent.hijos[3];
          ejecutarArbol(lcuerpo);
          agregar3d("//etiqueta de siguiente del for");
          agregar3dEtq(objDisplay.lsig);
          agregar3d("//aumento del for");
          asignarVariable(sent.hijos[2]);
          agregar3d("//salto a etiqueta de inicio del for");
          agregar3d("goto " + l + " ;");
          agregar3d("//etiquetas de falso del for");
          agregar3d(val.lf.join(" :\n") + " :");
          agregar3d("//etiqueta de salida del for");
          agregar3dEtq(objDisplay.lsalida);
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La condicion del for no es valida",
            fila: 0,
            columna: 0
          };
          agregarError(er);
        }
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el for");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.LOOP:
        //TODO: conlocar en DISPLAY la condicion para tener un break <id> relacionado a loop <id>
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: sent.id,
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el loop-id");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        agregar3d("//etiqueta de inicio de loop-id");
        l = getEtq();
        agregar3d(l + " :");
        agregar3d("//se ejecutar el cuerpo de loop-id");
        ejecutarArbol(sent.hijos[0]);
        agregar3d("//etiqueta de siguiente del loop-id");
        agregar3dEtq(objDisplay.lsig);
        agregar3d("goto " + l + " ;");
        agregar3d("//etiqueta de salida del loop-id");
        agregar3dEtq(objDisplay.lsalida);
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el loop-id");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.CONTAR:
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: sent.id,
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el count");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        agregar3d("//se evalua el valor de contar");
        val = evaluarValor(sent.hijos[0]);
        if(val.tipo === Const.tnum)
        {//se empieza a contar;
          var t = getTemp();
          agregar3d(t + " = 0;");
          agregar3d("//etiqueta de inicio de count");
          l = getEtq();
          var lv = getEtq();
          var lf = getEtq();
          agregar3d(l + " :");
          agregar3d("if (" + t + " < " + val.temp + " )goto " + lv + " ;");
          agregar3d("goto " + lf + " ;");
          agregar3d("//etiqueta de verdadero de count");
          agregar3d(lv + " :");
          agregar3d("//se ejecutar el cuerpo de count");
          ejecutarArbol(sent.hijos[1]);
          agregar3d("//etiqueta de siguiente");
          agregar3dEtq(objDisplay.lsig);
          agregar3d("//se aumento el contador de count");
          agregar3d(t + " = 1 + " + t);
          agregar3d("goto " + l + " ;");
          agregar3d("//etiqueta de falso de count");
          agregar3d(lf + " :");
          agregar3d("//etiqueta de salida");
          agregar3dEtq(objDisplay.lsalida);
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "Para realizar el conteo se necesita una variable [num], count(num)",
            fila: 0,
            columna: 0
          };
          agregarError(er);
        }
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el count");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.HACERX:
        ambActual = buscarAmbito(tabla[0], ambito.join("#"));
        aumentarDisplay(ambActual.tam);
        objDisplay = {
          // detener: false,
          // continuar: false,
          // retornar: false,
          nombre: "",
          id: sent.id,
          lsalida: getEtq(),
          lsig: getEtq(),
          tam: 0
        };
        display.push(objDisplay);
        agregar3d("//cambio de ambito para el do-whilex");
        agregar3d("p = p + " + ambActual.tam + " ;");
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        val = ejecutarArbol(sent.hijos[1]);
        //TODO: hacer el whilex
        var val2 = ejecutarArbol(sent.hijos[2]);
        ambito.pop();
        display.pop();
        disminuirDisplay(ambActual.tam);
        agregar3d("//regreso de ambito para el do-whilex");
        agregar3d("p = p - " + ambActual.tam + " ;");
        break;
      case Const.BREAK:
        if(sent.hijos.length === 0)
        {//el break no tiene id
          agregar3d("//regreso de ambito por break");
          agregar3dTOT("p", "p", display[display.length - 1].tam, "-");
          agregar3d("//goto break");
          agregar3dGoto(display[display.length - 1].lsalida);
        } else {
          var encontrado = false;
          var cont = 0;
          while (!encontrado && cont < display.length) {
            if(display[cont].id === sent.hijos[0])
              encontrado = true;
            cont++;
          }
          if(encontrado){
            cont--;
            agregar3d("//regreso de ambito por break");
            agregar3dTOT("p", "p", display[cont].tam, "-");
            agregar3d("//goto break id [" + sent.hijos[0] + "]");
            agregar3dGoto(display[cont].lsalida);
          }
        }
        break;
      case Const.CONTINUE:
        agregar3d("//regreso de ambito por continue");
        agregar3dTOT("p", "p", display[display.length - 1].tam, "-");
        agregar3d("//goto continue");
        agregar3dGoto(display[display.length - 1].lsig);
        break;
      case Const.outStr:
        metodoOutStr(sent);
        break;
      case Const.outNum:
        metodoOutNum(sent);
        break;
      case Const.inStr:
        metodoInStr(sent);
        break;
      case Const.LLAMADO:
        hacerLlamado(sent);
        break;
      case Const.RETURN:
        var existe = false;
        var pos = display.length - 1;
        while (!existe && pos >= 0) {
          if(display[pos].nombre !== "")
            existe = true;
          pos--;
        }
        if(existe){
          pos++;
          agregar3d("//regreso de ambito por return");
          agregar3dTOT("p", "p", display[pos].tam, "-");
        }
        var t1 = getTemp();
        if(sent.hijos.length === 0)
        {//el return no tiene hijos
          agregar3dTOT(t1, "p", "0", "+");
          agregar3dST("stack", t1, Const.NULL);
        } else {
          var valRet = evaluarValor(sent.hijos[0]);
          if(valRet.tipo === display[pos].tipo && valRet.tipoElemento === display[pos].tipoElemento){
            agregar3dTOT(t1, "p", "0", "+");
            agregar3dST("stack", t1, valRet.temp);
          } else {
            agregar3dTOT(t1, "p", "0", "+");
            agregar3dST("stack", t1, Const.NULL);
            var er2 = {
              tipo: "Error Semantico",
              descripcion: "La funcion [" + display[pos].nombre + "] no ha sido declarada de tipo [" + getTipo(valRet.tipo) + " (" + valRet.tipoElemento + ") ]",
  						fila: 0,
  						columna: 0
            };
            agregarError(er2);
          }
        }
        agregar3d("//goto return id [" + sent.hijos[0] + "]");
        agregar3dGoto(display[pos].lsalida);
        display[pos].retorno = true;
        break;
    }
  }
}

function evaluarValor(valor) {
  var er;
  switch(valor.nombre)
  {
    case "+" :
    case "*" :
    case "/" :
    case "%" :
    case "^" :
      var op1 = evaluarValor(valor.hijos[0]);
      var op2 = evaluarValor(valor.hijos[1]);
      return ejecutarAritmetica(op1, op2, valor.nombre);
    case "-" :
      op1 = evaluarValor(valor.hijos[0]);
      op2 = "";
      var codigo = "";
      var t = getTemp();
      var res = {temp : "tx", tipo : -1, tipoElemento: ""};
      if(valor.hijos.length === 1)
      {
        switch(op1.tipo)
        {
          case 1://- numero
          case 7://- bool
            codigo = t + " = -" + op1.temp + " ;";
            agregar3d(codigo);
            res.temp = t;
            res.tipo = 1;
            break;
          // case 3://-cadena
          default:
            //error estos valores no se pueden operar
            er = {
              tipo: "Error Semantico",
              descripcion: "No se pudo operar - [" + getTipo(op1.tipo) + "]",
  						fila: 0,
  						columna: 0
            };
            agregarError(er);
            break;
        }
      }
      else
      {
        op2 = evaluarValor(valor.hijos[1]);
        switch(op1.tipo + op2.tipo)
        {
          case 2://numero - numero
          case 8://numero - bool
            codigo = t + " = " + op1.temp + " " + valor.nombre + " " + op2.temp + " ;";
            agregar3d(codigo);
            res.temp = t;
            res.tipo = 1;
            break;
          // case 4://numero - cadena
          // case 6://cadena - cadena
          // case 10://cadena - bool
          // case 14://bool - bool
          default:
            //error estos valores no se pueden operar
            er = {
              tipo: "Error Semantico",
              descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] - [" + op2.tipo + "]",
  						fila: 0,
  						columna: 0
            };
            agregarError(er);
            res.temp = "tx";
            res.tipo = -1;
            break;
        }
      }
      return res;
    case "==" :
    case "!=" :
    case ">" :
    case "<" :
    case ">=" :
    case "<=" :
      op1 = evaluarValor(valor.hijos[0]);
      op2 = evaluarValor(valor.hijos[1]);
      return ejecutarRelacional(op1, op2, valor.nombre);
    case "&&" :
    case "&?" :
    case "||" :
    case "|?" :
    case "|&" :
    case "!" :
      return ejecutarLogica(valor);
    case "numero" :
        return {
          temp : valor.valor,
          tipo : Const.tnum,
          tipoElemento: ""
        };
    case Const.bool:
        if (valor.valor === "true")
          return {
            temp : "1",
            tipo : Const.tbool,
            tipoElemento: ""
          };
        else
          return {
            temp : "0",
            tipo : Const.tbool,
            tipoElemento: ""
          };
      break;
    case Const.LID:
      agregar3d("//se obtienen los temporales necesarios para [" + valor.hijos.join(".") + "]");
      var resid = resolverLID(valor);
      resid.temp = getTemp();
      if(valor.hijos.length === 1)
      {
        if(!resid.esGlobal){
          agregar3d("//se obtiene el valor en la pila de la variable [" + valor.hijos.join(".") + "]");
          agregar3d(resid.temp + " = stack [ " + resid.tempRef + " ] ;");
        } else {
          agregar3d("//se obtiene el valor en el heap de la variable global[" + valor.hijos.join(".") + "]");
          agregar3d(resid.temp + " = heap [ " + resid.tempRef + " ] ;");
        }
      } else {
        agregar3d("//se obtiene el valor en el heap de la variable [" + valor.hijos.join(".") + "]");
        agregar3d(resid.temp + " = heap [ " + resid.tempRef + " ] ;");
      }
      return resid;
    case "NULL" :
      return {
        temp : Const.NULL,
        tipo : Const.tid,
        tipoElemento : "NULL"
      };
    case Const.cadena:
      agregar3d("//se inicia la referecia para la cadena '" + valor.valor + "'");
      var temp = getTemp();
      agregar3d(temp  + " = h ;");
      agregar3d("h = h + 1 ;");
      agregar3d("heap [ " + temp + " ] = s ;");
      for (var i = 0; i < valor.valor.length; i++) {
        agregar3d("//se agrego al pool el caracter '" + valor.valor[i] + "'");
        agregar3d("pool [ s ] = " + valor.valor.charCodeAt(i) + " ;");
        agregar3d("s = s + 1 ;");
      }
      agregar3d("//se agrego al pool el final de la cadena");
      agregar3d("pool [ s ] = 0 ;");
      agregar3d("s = s + 1 ;");
      return{
        temp: temp,
        tipo: Const.tstr,
        tipoElemento: ""
      };
    case Const.NUEVO:
      return {
        temp: "tx",
        tipo: Const.tid,
        tipoElemento: ""
      };
    case Const.getBool:
      return metodoGetBool(valor);
    case Const.getLength:
      return metodoGetStrLength(valor);
    case Const.inNum:
      return metodoInNum(valor);
    case Const.LLAMADO:
      return hacerLlamado(valor);
  }//fin del switch
}

function asignarVariable(sent) {
  var val;
  if(sent.hijos[1].nombre !== Const.NUEVO){
    val = evaluarValor(sent.hijos[1]);
  } else {
    var llamado = recolectarNombres(sent.hijos[0]);
    var amb = buscarAmbito(tabla[0], ambito.join("#"));
    var temp1 = getTemp();
    var temp2 = getTemp();
    agregar3d("p = p + " + amb.tam + " ;");
    agregar3d("init#" + llamado + "() ;");
    agregar3d("//se obtiene el retorno del init");
    agregar3d(temp1 + " = p + 0 ;");
    agregar3d(temp2 + " = stack [ " + temp1 + " ] ;");
    agregar3d("p = p - " + amb.tam + " ;");
    val = {temp: temp2, tipo: Const.tid, tipoElemento: sent.hijos[1].id};
  }
  agregar3d("//temporales para la asignacion a [" + sent.hijos[0].hijos.join(".") + "]");
  var resid = resolverLID(sent.hijos[0]);
  if(sent.hijos[0].hijos.length === 1)
  {
    if(!resid.esGlobal){
      agregar3d("//se asigna el valor correspondiente a la variable [" + sent.hijos[0].hijos.join(".") + "] dentro de la pila");
      agregar3d("stack [ " + resid.tempRef + " ] = " + val.temp + " ;");
    } else {
      agregar3d("//se asigna el valor correspondiente a la variable global [" + sent.hijos[0].hijos.join(".") + "] dentro del heap");
      agregar3d("heap [ " + resid.tempRef + " ] = " + val.temp + " ;");
    }
  } else {
    agregar3d("//se asigna el valor correspondiente a la variable [" + sent.hijos[0].hijos.join(".") + "] dentro del heap");
    agregar3d("heap [ " + resid.tempRef + " ] = " + val.temp + " ;");
  }
}

function decVariable(sent) {
  var val;
  if(sent.hijos[1].nombre !== Const.NUEVO){
    val = evaluarValor(sent.hijos[1]);
  } else {
    var llamado = recolectarNombres(sent.hijos[0].hijos[0]);
    var amb = buscarAmbito(tabla[0], ambito.join("#"));
    var temp1 = getTemp();
    var temp2 = getTemp();
    agregar3dTOT("p", "p", amb.tam, "+");
    agregar3d("init#" + llamado + "() ;");
    agregar3d("//se obtiene el retorno del init");
    agregar3d(temp1 + " = p + 0 ;");
    agregar3d(temp2 + " = stack [ " + temp1 + " ] ;");
    agregar3d("p = p - " + amb.tam + " ;");
    val = {temp: temp2, tipo: Const.tid, tipoElemento: sent.hijos[1].id};
  }
  var lvariables = sent.hijos[0];
  for (var i = 0; i < lvariables.hijos.length; i++) {
    var lid = lvariables.hijos[i];
    var resid = resolverLID(lid);
    if(resid.tipo === val.tipo){
      if(!resid.esGlobal){
        agregar3d("//se asigna el valor correspondiente a la variable [" + lid.hijos.join(".") + "] dentro de la pila");
        agregar3d("stack [ " + resid.tempRef + " ] = " + val.temp + " ;");
      } else {
        agregar3d("//se asigna el valor correspondiente a la variable global [" + lid.hijos.join(".") + "] dentro de la pila");
        agregar3d("heap [ " + resid.tempRef + " ] = " + val.temp + " ;");
      }
    } else {
      var er = {
        tipo: "Error Semantico",
        descripcion: "No se pudo asignar [" + getTipo(resid.tipo) + "] = [" + getTipo(val.tipo) +"]",
        fila: 0,
        columna: 0
      };
      agregarError(er);
    }
  }
}
