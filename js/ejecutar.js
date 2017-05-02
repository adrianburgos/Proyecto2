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
        //se evalua la condicion del if
        val = evaluarValor(sent.hijos[0]);
        //si es de tipo bool (7) todo esta bien
        if(val.tipo === Const.tbool)
        {//se procede a colocar las etiquetas de verdad y falso en su lugar
          agregar3d("//etiquetas de verdad del if");
          agregar3d(val.lv.join(":\n") + ":");
          ejecutarArbol(lcuerpo);
          if (sent.hijos.length === 3) {//posee un ELSE
            l = getEtq();
            agregar3d("//salto para no ejecutar el ELSE");
            agregar3d("goto " + l + ";");
            lcuerpo = sent.hijos[2];
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(":\n") + ":");
            ejecutarArbol(lcuerpo);
            agregar3d("//salida de las instrucciones de verdadero");
            agregar3d(l + ":");
          }
          else {
            agregar3d("//etiquetas de falso del if");
            agregar3d(val.lf.join(":\n") + ":");
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
        break;
      case Const.HACER:
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
        break;
      case Const.REPETIR:
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
        break;
      case Const.PARA:
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
        break;
      case Const.LOOP:
        //TODO: conlocar en DISPLAY la condicion para tener un break <id> relacionado a loop <id>
        agregar3d("//etiqueta de inicio de loop");
        l = getEtq();
        agregar3d(l + ":");
        agregar3d("//se ejecutar el cuerpo de loop");
        ejecutarArbol(sent.hijos[0]);
        agregar3d("goto " + l + ";");
        break;
      case Const.CONTAR:
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
        break;
      case Const.HACERX:
        val = ejecutarArbol(sent.hijos[1]);
        //TODO: hacer el whilex
        var val2 = ejecutarArbol(sent.hijos[2]);
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
      //buscar la variable
      break;
  }
}

function ejecutarAritmetica(op1, op2, operador) {
  var res = {temp : "tx", tipo : -1};
  var t = getTemp();
  switch(operador)
  {
    case "+":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero + numero
        case 8://numero + bool
        case 14://bool + bool
          var codigo = t + " = " + op1.temp + " " + operador + " " + op2.temp + ";";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = 1;
          break;
        case 4://numero + cadena
        case 6://cadena + cadena
        case 10://cadena + bool
          //TODO: Concatenacion (cadena-cadena cadena-numero cadena-bool)
          break;
      }
      break;
    case "*":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero * numero
        case 8://numero * bool
        case 14://bool * bool
          codigo = t + " = " + op1.temp + " " + operador + " " + op2.temp + ";";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = 1;
          break;
        // case 4://numero * cadena
        // case 6://cadena * cadena
        // case 10://cadena * bool
        default:
          //error estos valores no se pueden operar
          var er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case "/":
    case "%":
    case "^":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero /(%)(^) numero
        case 8://numero /(%)(^) bool
          codigo = t + " = " + op1.temp + " " + operador + " " + op2.temp + ";";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = 1;
          break;
        // case 14://bool /(%)(^) bool
        // case 4://numero /(%)(^) cadena
        // case 6://cadena /(%)(^) cadena
        // case 10://cadena /(%)(^) bool
        default:
          //error estos valores no se pueden operar
          er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
  }
  return res;
}

function ejecutarRelacional(op1, op2, operador) {
  var res = {temp : "tx", tipo : -1, lv: [], lf: [] };
  switch(operador)
  {
    case "==":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero == numero
        case 14://bool == bool
          var lv = getEtq();
          var lf = getEtq();
          var codigo =
            "if (" + op1.temp + " " + operador + " " + op2.temp + ") goto " + lv + ";\n" +
            "goto " + lf + ";";
          agregar3d(codigo);
          res.tipo = 7;
          res.lv.push(lv);
          res.lf.push(lf);
          break;
        case 6://cadena == cadena
          //TODO: comparacion de cadena con cadena
          break;
        // case 8://numero == bool
        // case 4://numero == cadena
        // case 10://cadena == bool
        default:
          //error estos valores no se pueden operar
          var er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case "!=":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero != numero
        case 14://bool != bool
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if (" + op1.temp + " " + operador + " " + op2.temp + ") goto " + lv + ";\n" +
            "goto " + lf + ";";
          agregar3d(codigo);
          res.tipo = 7;
          res.lv.push(lv);
          res.lf.push(lf);
          break;
        case 6://cadena != cadena
          //TODO: comparacion (!=) entre cadenas
          break;
        // case 8://numero != bool
        // case 4://numero != cadena
        // case 10://cadena != bool
        default:
          //error estos valores no se pueden operar
          er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case ">":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero > numero
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if (" + op1.temp + " " + operador + " " + op2.temp + ") goto " + lv + ";\n" +
            "goto " + lf + ";";
          agregar3d(codigo);
          res.tipo = 7;
          res.lv.push(lv);
          res.lf.push(lf);
          break;
        case 6://cadena > cadena
          //TODO: comparacion (>) entre cadenas
          break;
        // case 8://numero > bool
        // case 4://numero > cadena
        // case 10://cadena > bool
        // case 14://bool > bool
        default:
          //error estos valores no se pueden operar
          er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case "<":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero < numero
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if (" + op1.temp + " " + operador + " " + op2.temp + ") goto " + lv + ";\n" +
            "goto " + lf + ";";
          agregar3d(codigo);
          res.tipo = 7;
          res.lv.push(lv);
          res.lf.push(lf);
          break;
        case 6://cadena < cadena
          //TODO: comparacion (<) entre cadenas
          break;
        // case 8://numero < bool
        // case 4://numero < cadena
        // case 10://cadena < bool
        // case 14://bool < bool
        default:
          //error estos valores no se pueden operar
          er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          res.temp = "tx";
          res.tipo = -1;
          break;
      }
      break;
    case ">=":
    case "<=":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero >= (<=) numero
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if (" + op1.temp + " " + operador + " " + op2.temp + ") goto " + lv + ";\n" +
            "goto " + lf + ";";
          agregar3d(codigo);
          res.tipo = 7;
          res.lv.push(lv);
          res.lf.push(lf);
          break;
        // case 6://cadena >= (<=) cadena
        // case 8://numero >= (<=) bool
        // case 4://numero >= (<=) cadena
        // case 10://cadena >= (<=) bool
        // case 14://bool >= (<=) bool
        default:
          //error estos valores no se pueden operar
          er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          res.temp = "tx";
          res.tipo = -1;
          break;
      }
      break;
  }
  return res;
}

function ejecutarLogica(valor) {
  var operador = valor.nombre;
  var res = {temp : "tx", tipo : -1, lv: [], lf: [] };
  var op1 = evaluarValor(valor.hijos[0]);
  var lv = "";
  var er;
  if(valor.hijos[0].nombre === Const.bool)
    op1 = codigoBoolean(valor.hijos[0]);
  switch(operador)
  {
    case "&&":
    case "&?":
      if(op1.tipo === Const.tbool)
        agregar3d(op1.lv.join(":\n") + ":");
      var op2 = evaluarValor(valor.hijos[1]);
      if(valor.hijos[1].nombre === Const.bool)
        op2 = codigoBoolean(valor.hijos[1]);
      if(op2.tipo === Const.tbool)
      {
        res.tipo = 7;
        res.lv = res.lv.concat(op2.lv);
        res.lf = res.lf.concat(op1.lf);
        res.lf = res.lf.concat(op2.lf);
        if(operador === "&?")
        {
          lv = res.lv;
          res.lv = res.lf;
          res.lf = lv;
        }
      }
      else
      {//error estos valores no se pueden operar
        er = {
          tipo: "Error Semantico",
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
          fila: 0,
          columna: 0
        };
        agregarError(er);
      }
      break;
    case "||":
    case "|?":
      if(op1.tipo === Const.tbool)
        agregar3d(op1.lf.join(":\n") + ":");
      op2 = evaluarValor(valor.hijos[1]);
      if(valor.hijos[1].nombre === Const.bool)
        op2 = codigoBoolean(valor.hijos[1]);
      if(op2.tipo === Const.tbool)
      {
        res.tipo = 7;
        res.lv = res.lv.concat(op1.lv);
        res.lv = res.lv.concat(op2.lv);
        res.lf = res.lf.concat(op2.lf);
        if(operador === "|?")
        {
          lv = res.lv;
          res.lv = res.lf;
          res.lf = lv;
        }
      }
      else
      {//error estos valores no se pueden operar
        er = {
          tipo: "Error Semantico",
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
          fila: 0,
          columna: 0
        };
        agregarError(er);
      }
      break;
    case "!":
      res.lv = op1.lf;
      res.lf = op1.lv;
      res.tipo = 7;
      break;
    case "|&":
      var txor = getTemp();
      if(op1.tipo === Const.tbool)
      {
        var lcond = getEtq();
        agregar3d(op1.lv.join(":\n") + ":");
        agregar3d(txor + " = 1;");
        agregar3d("goto " + lcond + ";");
        agregar3d(op1.lf.join(":\n") + ":");
        agregar3d(txor + " = 0;");
        agregar3d(lcond + ":");
      }
      op2 = evaluarValor(valor.hijos[1]);
      if(valor.hijos[1].nombre === Const.bool)
        op2 = codigoBoolean(valor.hijos[1]);
      if(op2.tipo === Const.tbool)
      {
        lv = getEtq();
        var lf = getEtq();
        agregar3d(op2.lv + ":");
        agregar3d("if (" + txor + " == 1) goto " + lv + ";");
        agregar3d("goto " + lf + ";");
        agregar3d(op2.lf + ":");
        agregar3d("if (" + txor + " == 0) goto " + lv + ";");
        agregar3d("goto " + lf + ";");
        res.tipo = 7;
        res.lv.push(lv);
        res.lf.push(lf);
      }
      else
      {//error estos valores no se pueden operar
        er = {
          tipo: "Error Semantico",
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + op2.tipo + "]",
          fila: 0,
          columna: 0
        };
        agregarError(er);
      }
      break;
  }
  return res;
}

function codigoBoolean(valor) {
  var lv = getEtq();
  var lf = getEtq();
  var codigo = "";
  if (valor.valor === "true")
    codigo = "if ( 1 == 1 ) goto " + lv +"; \ngoto " + lf + ";";
  else
    codigo = "if ( 1 == 0 ) goto " + lv +"; \ngoto " + lf + ";";
  agregar3d(codigo);
  return { temp: "tx", tipo : 7, lv : [lv], lf : [lf] };
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

function getTipo(tipo) {
  switch(tipo)
  {
    case 1: return Const.num;
    case 3: return Const.str;
    case 7: return Const.bool;
    case 99: return Const.void;
    case -1: return "";
  }
  switch(tipo)
  {
    case "num": return Const.tnum;
    case "str": return Const.tstr;
    case Const.bool: return Const.tbool;
    case "void": return Const.tvoid;
  }
  return tipo;
}
