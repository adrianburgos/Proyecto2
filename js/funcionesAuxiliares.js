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
        default:
          //error estos valores no se pueden operar
          var er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
            fila: 0,
            columna: 0
          };
          agregarError(er);
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + "] " + operador + " [" + getTipo(op2.tipo) + "]",
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

function getTipo(tipo) {
  switch(tipo)
  {
    case 1: return Const.num;
    case 3: return Const.str;
    case 7: return Const.bool;
    case 99: return Const.void;
    case Const.tid: return "element";
    case -1: return "";
  }
  switch(tipo)
  {
    case "num": return Const.tnum;
    case "str": return Const.tstr;
    case Const.bool: return Const.tbool;
    case "void": return Const.tvoid;
    default: return Const.tid;
  }
  return "";
}

function resolverLID(valor) {
  var resid = {
    temp : "tx",
    tempRef :  "ty",
    tipo : -1,
    tipoElemento : "",
    esGlobal : false
  };
  //buscar la variable
  if(valor.hijos[0].nombre !== Const.LLAMADO)
  {//solo contiene una lista de ids
    var variable = buscarVariable(valor.hijos[0]);
    if (variable !== null) {
      var tempRef = getTemp();
      var tempVal = "";
      if(variable.variable.ambito !== "global"){
        agregar3d("//se obtiene la referencia a la variable [" + valor.hijos[0] + "]");
        agregar3d(tempRef + " = " + variable.temp + " + " + variable.variable.pos + ";");
      } else {
        resid.esGlobal = true;
        agregar3d("//se obtiene la referencia a la variable global [" + valor.hijos[0] + "]");
        agregar3d(tempRef + " = " + variable.variable.pos + ";");
      }
      resid.tempRef = tempRef;
      resid.tipo = variable.variable.tipo;
      resid.tipoElemento = variable.variable.tipoElemento;
      if(valor.hijos.length >= 2){
        tempVal = getTemp();
        if(variable.variable.ambito !== "global"){
          agregar3d("//se obtiene el valor en la pila de la variable [" + valor.hijos[0] + "]");
          agregar3d(tempVal + " = stack[" + tempRef + "];");
        } else {
          resid.esGlobal = true;
          agregar3d("//se obtiene el valor en el heap de la variable global [" + valor.hijos[0] + "]");
          agregar3d(tempVal + " = heap[" + tempRef + "];");
        }
      }
      var cont = 1;
      var nombreEle = "global";
      if(valor.hijos.length > 1 && resid.tipo !== Const.tid) {
        er = {
          tipo: "Error Semantico",
          descripcion: "La variable [" + valor.hijos[0] + "] no es un element",
          fila: 0,
          columna: 0
        };
        agregarError(er);
      } else
      while (cont < valor.hijos.length && resid.tipo === Const.tid) {
        nombreEle += "#" + resid.tipoElemento;
        var ele = buscarAmbito(tabla[0], nombreEle);
        if(ele !== null)
        {
          var atr = buscarAtributo(ele, valor.hijos[cont]);
          if (atr !== null) {
            if(cont >= 2){
              tempVal = getTemp();
              agregar3d(tempVal + " = heap[" + temp3 + "];");
            }
            var temp3 = getTemp();
            agregar3d("//se obtiene la posicion de [" + valor.hijos[cont] + "] dentro del Element [" + resid.tipoElemento + "]");
            agregar3d(temp3 + " = " + tempVal + " + " + atr.pos + ";");
            tempRef = temp3;
            resid.tempRef = tempRef;
            resid.tipo = atr.tipo;
            resid.tipoElemento = atr.tipoElemento;
            resid.esGlobal = false;
          } else {
            er = {
              tipo: "Error Semantico",
              descripcion: "El atributo [" + valor.hijos[cont] + "] no existe dentro del Element [" + resid.tipoElemento + "]",
              fila: 0,
              columna: 0
            };
            agregarError(er);
          }
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "El ELEMENT [" + resid.tipoElemento + "] no ha sido declarado",
            fila: 0,
            columna: 0
          };
          agregarError(er);
        }
        cont++;
      }
    } else {
      er = {
        tipo: "Error Semantico",
        descripcion: "La variable [" + valor.hijos[0] + "] no ha sido declarada",
        fila: 0,
        columna: 0
      };
      agregarError(er);
    }
  } else {
    //TODO: realizar instrucciones cuando el primer id es un llamado
  }
  return resid;
}
