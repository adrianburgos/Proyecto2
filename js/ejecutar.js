var contAmbActual = 0;

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
      case "ASIGNACION":
        asignarVariable(sent);
        break;
      case Const.DECVAR:
        decVariable(sent);
        break;
      case Const.SI:
        var lcuerpo = sent.hijos[1];
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se evalua la condicion del if
        val = evaluarValor(sent.hijos[0]);
        //si es de tipo bool (7) todo esta bien
        if(val.tipo === Const.tbool)
        {//se procede a colocar las etiquetas de verdad y falso en su lugar
          agregar3d("//etiquetas de verdad del if");
          agregar3d(val.lv.join(":\n") + ":");
          ejecutarArbol(lcuerpo);
          if (sent.hijos.length === 3) {//posee un ELSE
            ambito.pop();
            ambito.push("ELSE" + contAmbActual);
            contAmbActual++;
            l = getEtq();
            agregar3d("//salto para no ejecutar el ELSE");
            agregar3d("goto " + l + ";");
            lcuerpo = sent.hijos[2];
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(":\n") + ":");
            ejecutarArbol(lcuerpo);
            agregar3d("//salida de las instrucciones de verdadero");
            agregar3d(l + ":");
            ambito.pop();
          }
          else {
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(":\n") + ":");
            ambito.pop();
          }
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La condicion del if-then no es valida",
						fila: 0,
						columna: 0
          };
          agregarError(er);
        }
        break;
      case Const.MIENTRAS:
        //TODO: verificar sentencias de escape con DISPLAY dentro de ciclos
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del while");
        agregar3d(l + ":");
        val = evaluarValor(sent.hijos[0]);
        if(val.tipo === Const.tbool)
        {
          agregar3d("//etiquetas de verdadero del while");
          agregar3d(val.lv.join(":\n") + ":");
          lcuerpo = sent.hijos[1];
          ejecutarArbol(lcuerpo);
          agregar3d("//salto a etiqueta de inicio del while");
          agregar3d("goto " + l + ";");
          agregar3d("//etiquetas de falso del while");
          agregar3d(val.lf.join(":\n") + ":");
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
        break;
      case Const.HACER:
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del do-while");
        agregar3d(l + ":");
        lcuerpo = sent.hijos[0];
        ejecutarArbol(lcuerpo);
        val = evaluarValor(sent.hijos[1]);
        if(val.tipo === Const.tbool)
        {
          agregar3d("//etiquetas de verdadero del do-while");
          agregar3d(val.lv.join(":\n") + ":");
          agregar3d("//salto a etiqueta de inicio del do-while");
          agregar3d("goto " + l + ";");
          agregar3d("//etiquetas de falso del do-while");
          agregar3d(val.lf.join(":\n") + ":");
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
        break;
      case Const.REPETIR:
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se escribe la etiqueta de inicio para el ciclo
        l = getEtq();
        agregar3d("//etiqueta de inicio del repeat-until");
        agregar3d(l + ":");
        lcuerpo = sent.hijos[0];
        ejecutarArbol(lcuerpo);
        val = evaluarValor(sent.hijos[1]);
        if(val.tipo === Const.tbool)
        {
          agregar3d("//etiquetas de falso del repeat-until");
          agregar3d(val.lf.join(":\n") + ":");
          agregar3d("//salto a etiqueta de inicio del repeat-until");
          agregar3d("goto " + l + ";");
          agregar3d("//etiquetas de verdadero del repeat-until");
          agregar3d(val.lv.join(":\n") + ":");
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
        break;
      case Const.PARA:
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
        agregar3d(l + ":");
        //se evalua la condicion del for
        val = evaluarValor(sent.hijos[1]);
        if(val.tipo === Const.tbool)
        {//si la condicion es de tipo bool(7) se ejecuta su cuerpo
          agregar3d("//etiquetas de verdadero del for");
          agregar3d(val.lv.join(":\n") + ":");
          agregar3d("//se ejecuta el cuerpo del for");
          lcuerpo = sent.hijos[3];
          ejecutarArbol(lcuerpo);
          agregar3d("//aumento del for");
          asignarVariable(sent.hijos[2]);
          agregar3d("//salto a etiqueta de inicio del for");
          agregar3d("goto " + l + ";");
          agregar3d("//etiquetas de falso del for");
          agregar3d(val.lf.join(":\n") + ":");
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
        break;
      case Const.LOOP:
        //TODO: conlocar en DISPLAY la condicion para tener un break <id> relacionado a loop <id>
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        agregar3d("//etiqueta de inicio de loop");
        l = getEtq();
        agregar3d(l + ":");
        agregar3d("//se ejecutar el cuerpo de loop");
        ejecutarArbol(sent.hijos[0]);
        agregar3d("goto " + l + ";");
        ambito.pop();
        break;
      case Const.CONTAR:
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
          agregar3d(l + ":");
          agregar3d("if (" + t + " < " + val.temp + " ) goto " + lv + ";");
          agregar3d("goto " + lf + ";");
          agregar3d("//etiqueta de verdadero de count");
          agregar3d(lv + ":");
          agregar3d("//se ejecutar el cuerpo de count");
          ejecutarArbol(sent.hijos[1]);
          agregar3d("//se aumento el contador de count");
          agregar3d(t + " = 1 + " + t);
          agregar3d("goto " + l + ";");
          agregar3d("//etiqueta de falso de count");
          agregar3d(lf + ":");
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
        break;
      case Const.HACERX:
        //se agrega el ambito actual
        ambito.push(sent.nombre + contAmbActual);
        contAmbActual++;
        val = ejecutarArbol(sent.hijos[1]);
        //TODO: hacer el whilex
        var val2 = ejecutarArbol(sent.hijos[2]);
        ambito.pop();
        break;
    }
  }
}

function evaluarValor(valor) {
  var er;
  switch(valor.nombre)
  {
    case "+":
    case "*":
    case "/":
    case "%":
    case "^":
      var op1 = evaluarValor(valor.hijos[0]);
      var op2 = evaluarValor(valor.hijos[1]);
      return ejecutarAritmetica(op1, op2, valor.nombre);
    case "-":
      op1 = evaluarValor(valor.hijos[0]);
      op2 = "";
      var codigo = "";
      var t = getTemp();
      var res = {temp : "tx", tipo : -1};
      if(valor.hijos.length === 1)
      {
        switch(op1.tipo)
        {
          case 1://- numero
          case 7://- bool
            codigo = t + " = -" + op1.temp + ";";
            agregar3d(codigo);
            res.temp = t;
            res.tipo = 1;
            break;
          // case 3://-cadena
          default:
            //error estos valores no se pueden operar
            er = {
              tipo: "Error Semantico",
              descripcion: "No se pudo operar -[" + getTipo(op1.tipo) + "]",
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
            codigo = t + " = " + op1.temp + " " + valor.nombre + " " + op2.temp + ";";
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
    case "==":
    case "!=":
    case ">":
    case "<":
    case ">=":
    case "<=":
      op1 = evaluarValor(valor.hijos[0]);
      op2 = evaluarValor(valor.hijos[1]);
      return ejecutarRelacional(op1, op2, valor.nombre);
    case "&&":
    case "&?":
    case "||":
    case "|?":
    case "|&":
    case "!":
      return ejecutarLogica(valor);
    case "numero":
        return {
          temp : valor.valor,
          tipo : 1
        };
    case Const.bool:
        if (valor.valor === "true")
          return {
            temp : "1",
            tipo : 7
          };
        else
          return {
            temp : "0",
            tipo : 7
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
          agregar3d(resid.temp + " = stack[" + resid.tempRef + "];");
        } else {
          agregar3d("//se obtiene el valor en el heap de la variable global[" + valor.hijos.join(".") + "]");
          agregar3d(resid.temp + " = heap[" + resid.tempRef + "];");
        }
      } else {
        agregar3d("//se obtiene el valor en el heap de la variable [" + valor.hijos.join(".") + "]");
        agregar3d(resid.temp + " = heap[" + resid.tempRef + "];");
      }
      return resid;
    case "NULL":
      return {
        temp : Const.NULL,
        tipo : -1
      };
    case Const.cadena:
      agregar3d("//se inicia la referecia para la cadena [" + valor.valor + "]");
      break;
  }//fin del switch
}

function asignarVariable(sent) {
  var val = evaluarValor(sent.hijos[1]);
  agregar3d("//temporales para la asignacion a [" + sent.hijos[0].hijos.join(".") + "]");
  var resid = resolverLID(sent.hijos[0]);
  if(sent.hijos[0].hijos.length === 1)
  {
    if(!resid.esGlobal){
      agregar3d("//se asigna el valor correspondiente a la variable [" + sent.hijos[0].hijos.join(".") + "] dentro de la pila");
      agregar3d("stack[" + resid.tempRef + "] = " + val.temp + ";");
    } else {
      agregar3d("//se asigna el valor correspondiente a la variable global [" + sent.hijos[0].hijos.join(".") + "] dentro del heap");
      agregar3d("heap[" + resid.tempRef + "] = " + val.temp + ";");
    }
  } else {
    agregar3d("//se asigna el valor correspondiente a la variable [" + sent.hijos[0].hijos.join(".") + "] dentro del heap");
    agregar3d("heap[" + resid.tempRef + "] = " + val.temp + ";");
  }
}

function decVariable(sent) {
  var val = evaluarValor(sent.hijos[1]);
  var lvariables = sent.hijos[0];
  for (var i = 0; i < lvariables.hijos.length; i++) {
    var lid = lvariables.hijos[i];
    var resid = resolverLID(lid);
    if(!resid.esGlobal){
      agregar3d("//se asigna el valor correspondiente a la variable [" + lid.hijos.join(".") + "] dentro de la pila");
      agregar3d("stack[" + resid.tempRef + "] = " + val.temp + ";");
    } else {
      agregar3d("//se asigna el valor correspondiente a la variable global [" + lid.hijos.join(".") + "] dentro de la pila");
      agregar3d("heap[" + resid.tempRef + "] = " + val.temp + ";");
    }
  }
}
