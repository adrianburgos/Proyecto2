var amb3D = ["global"];
var contAmbActual = 0;
function buscarPrincipal(raiz) {
  for (var i = 0; i < raiz.hijos.length; i++) {
    if(raiz.hijos[i].nombre === "PRINCIPAL")
      return raiz.hijos[i];
  }
  return null;
}

function ejecutarArbol(cuerpo) {
  console.log("ejecutarArbol");
  console.log(cuerpo);
  for (var i = 0; i < cuerpo.hijos.length; i++) {
    console.log("hijo[" + i + "]");
    console.log(cuerpo.hijos[i]);
    var sent = cuerpo.hijos[i];
    var l = "";
    var er;
    switch(sent.nombre)
    {
      case "ASIGNACION":
        var val = asignarVariable(sent);
        console.log(val);
        break;
      case Const.SI:
        var lcuerpo = sent.hijos[1];
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
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
            amb3D.pop();
            amb3D.push("ELSE" + contAmbActual);
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
            amb3D.pop();
          }
          else {
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(":\n") + ":");
            amb3D.pop();
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
        amb3D.push(sent.nombre + contAmbActual);
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
        amb3D.pop();
        break;
      case Const.HACER:
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
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
        amb3D.pop();
        break;
      case Const.REPETIR:
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
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
        amb3D.pop();
        break;
      case Const.PARA:
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
        contAmbActual++;
        //se realiza la asignacion a la variable de control
        agregar3d("//asignacion a la variable de control del for");
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
        amb3D.pop();
        break;
      case Const.LOOP:
        //TODO: conlocar en DISPLAY la condicion para tener un break <id> relacionado a loop <id>
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
        contAmbActual++;
        agregar3d("//etiqueta de inicio de loop");
        l = getEtq();
        agregar3d(l + ":");
        agregar3d("//se ejecutar el cuerpo de loop");
        ejecutarArbol(sent.hijos[0]);
        agregar3d("goto " + l + ";");
        amb3D.pop();
        break;
      case Const.CONTAR:
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
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
        amb3D.pop();
        break;
      case Const.HACERX:
        //se agrega el ambito actual
        amb3D.push(sent.nombre + contAmbActual);
        contAmbActual++;
        val = ejecutarArbol(sent.hijos[1]);
        //TODO: hacer el whilex
        var val2 = ejecutarArbol(sent.hijos[2]);
        amb3D.pop();
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
      var resid = {
        temp : "tx",
        tempRef :  "ty",
        tipo : -1,
        tipoElemento : ""
      };
      //buscar la variable
      if(valor.hijos[0].nombre !== Const.LLAMADO)
      {//solo contiene una lista de ids
        var variable = buscarVariable(valor.hijos[0]);
        if (variable.variable !== null) {
          var tempRef = getTemp();
          var tempVal = getTemp();
          agregar3d("//se obtiene la referencia a la variable [" + valor.hijos[0] + "]");
          agregar3d(tempRef + " = " + variable.temp + " + " + variable.variable.pos);
          agregar3d("//se obtiene el valor en la pila de la variable [" + valor.hijos[0] + "]");
          agregar3d(tempVal + " = stack[" + tempRef + "]");
          resid.temp = tempVal;
          resid.tempRef = tempRef;
          resid.tipo = variable.variable.tipo;
          resid.tipoElemento = variable.variable.tipoElemento;
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "La variable [" + valor.hijos[0] + "] no ha sido declarada",
						fila: 0,
						columna: 0
          };
          agregarError(er);
        }
      }
      return resid;
  }//fin del switch
}

function asignarVariable(sent) {
  //TODO: completar la asignacion de variables
  var val = evaluarValor(sent.hijos[1]);
  return val;
}

function decVariable(sent) {
  //TODO: completar la declaracion de variables
  var val;
  if(sent.hijos > 1)
  {
    val = evaluarValor(sent.hijos[1]);
  }
  return val;
}

function buscarVariable(id) {
  var encontrado = false;
  var amb;
  var contAmb = amb3D.length;
  var tamTotal = 0;
  var t = "p";
  while (!encontrado && contAmb !== 0) {
    //ambito a buscar
    amb = "global";
    for (var i = 1; i < contAmb; i++) {
      amb += "#" + amb3D[i];
    }
    var objAmbito = buscarAmbito(tabla[0], amb);
    amb = "global";
    for (i = 1; i < contAmb - 1; i++) {
      amb += "#" + amb3D[i];
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
    agregar3d(t + " = p - " + tamTotal);
    contAmb--;
  }
  return null;
}
