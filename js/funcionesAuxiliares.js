function ejecutarAritmetica(op1, op2, operador) {
  var res = {temp : "tx", tipo : -1};
  var t = getTemp();
  switch(operador)
  {
    case "+" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero + numero
        case 8://numero + bool
        case 14://bool + bool
          var codigo = t + " = " + op1.temp + " " + operador + " " + op2.temp + " ;";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = Const.tnum;
          break;
          //TODO: Concatenacion (cadena-cadena cadena-numero cadena-bool)
        case 4://numero + cadena
          res = concatenarNumCadena(op1, op2, t);
          break;
        case 10://cadena + bool
          if(op1.tipo === Const.tbool){
            if(!op1.hasOwnProperty("lv")){
              op1 = construirCadenaTrueoFalse(op1, t);
            } else {
              var er = {
                tipo: "Error Semantico",
                descripcion: "Solo se puede operar [true o false] " + operador + " [" + getTipo(op2.tipo) + " ]",
                fila: 0,
                columna: 0
              };
              agregarError(er);
            }
          }
          if(op2.tipo === Const.tbool){
            if(!op2.hasOwnProperty("lv")){
              op2 = construirCadenaTrueoFalse(op2, t);
            } else {
              var er2 = {
                tipo: "Error Semantico",
                descripcion: "Solo se puede operar [" + getTipo(op1.tipo) + " ] " + operador + " [true o false]",
                fila: 0,
                columna: 0
              };
              agregarError(er2);
            }
          }
          res = concatenarCadenas(op1, op2, getTemp());
          break;
        case 6://cadena + cadena
          res = concatenarCadenas(op1, op2, t);
          break;
        default:
          //error estos valores no se pueden operar
          var er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
            fila: 0,
            columna: 0
          };
          agregarError(er);
      }
      break;
    case "*" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero * numero
        case 8://numero * bool
        case 14://bool * bool
          codigo = t + " = " + op1.temp + " " + operador + " " + op2.temp + " ;";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = Const.tnum;
          break;
        // case 4://numero * cadena
        // case 6://cadena * cadena
        // case 10://cadena * bool
        default:
          //error estos valores no se pueden operar
          var er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case "/" :
    case "%" :
    case "^" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero /(%)(^) numero
        case 8://numero /(%)(^) bool
          codigo = t + " = " + op1.temp + " " + operador + " " + op2.temp + " ;";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = Const.tnum;
          break;
        // case 14://bool /(%)(^) bool
        // case 4://numero /(%)(^) cadena
        // case 6://cadena /(%)(^) cadena
        // case 10://cadena /(%)(^) bool
        default:
          //error estos valores no se pueden operar
          er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
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
    case "==" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero == numero
        case 14://bool == bool
          var lv = getEtq();
          var lf = getEtq();
          var codigo =
            "if( " + op1.temp + " " + operador + " " + op2.temp + " )goto " + lv + " ;\n" +
            "goto " + lf + " ;";
          agregar3d(codigo);
          res.tipo = Const.tbool;
          res.lv.push(lv);
          res.lf.push(lf);
          break;
        case 6://cadena == cadena
          //TODO: comparacion (==) entre cadenas
          break;
        // case 8://numero == bool
        // case 4://numero == cadena
        // case 10://cadena == bool
        default:
          //error estos valores no se pueden operar
          var er = {
            tipo: "Error Semantico",
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case "!=" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero != numero
        case 14://bool != bool
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if( " + op1.temp + " " + operador + " " + op2.temp + " )goto " + lv + " ;\n" +
            "goto " + lf + " ;";
          agregar3d(codigo);
          res.tipo = Const.tbool;
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case ">" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero > numero
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if( " + op1.temp + " " + operador + " " + op2.temp + " )goto " + lv + " ;\n" +
            "goto " + lf + " ;";
          agregar3d(codigo);
          res.tipo = Const.tbool;
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          break;
      }
      break;
    case "<" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero < numero
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if( " + op1.temp + " " + operador + " " + op2.temp + " )goto " + lv + " ;\n" +
            "goto " + lf + " ;";
          agregar3d(codigo);
          res.tipo = Const.tbool;
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
						fila: 0,
						columna: 0
          };
          agregarError(er);
          res.temp = "tx";
          res.tipo = -1;
          break;
      }
      break;
    case ">=" :
    case "<=" :
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero >= (<=) numero
          lv = getEtq();
          lf = getEtq();
          codigo =
            "if( " + op1.temp + " " + operador + " " + op2.temp + " )goto " + lv + " ;\n" +
            "goto " + lf + " ;";
          agregar3d(codigo);
          res.tipo = Const.tbool;
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
            descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
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
    case "&&" :
    case "&?" :
      if(op1.tipo === Const.tbool)
        agregar3d(op1.lv.join(" :\n") + " :");
      var op2 = evaluarValor(valor.hijos[1]);
      if(valor.hijos[1].nombre === Const.bool)
        op2 = codigoBoolean(valor.hijos[1]);
      if(op2.tipo === Const.tbool)
      {
        res.tipo = Const.tbool;
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
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
          fila: 0,
          columna: 0
        };
        agregarError(er);
      }
      break;
    case "||" :
    case "|?" :
      if(op1.tipo === Const.tbool)
        agregar3d(op1.lf.join(" :\n") + " :");
      op2 = evaluarValor(valor.hijos[1]);
      if(valor.hijos[1].nombre === Const.bool)
        op2 = codigoBoolean(valor.hijos[1]);
      if(op2.tipo === Const.tbool)
      {
        res.tipo = Const.tbool;
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
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
          fila: 0,
          columna: 0
        };
        agregarError(er);
      }
      break;
    case "!" :
      res.lv = op1.lf;
      res.lf = op1.lv;
      res.tipo = Const.tbool;
      break;
    case "|&" :
      var txor = getTemp();
      if(op1.tipo === Const.tbool)
      {
        var lcond = getEtq();
        agregar3d(op1.lv.join(" :\n") + " :");
        agregar3d(txor + " = 1 ;");
        agregar3d("goto " + lcond + " ;");
        agregar3d(op1.lf.join(" :\n") + " :");
        agregar3d(txor + " = 0 ;");
        agregar3d(lcond + " :");
      }
      op2 = evaluarValor(valor.hijos[1]);
      if(valor.hijos[1].nombre === Const.bool)
        op2 = codigoBoolean(valor.hijos[1]);
      if(op2.tipo === Const.tbool)
      {
        lv = getEtq();
        var lf = getEtq();
        agregar3d(op2.lv + " :");
        agregar3d("if( " + txor + " == 1 )goto " + lv + " ;");
        agregar3d("goto " + lf + " ;");
        agregar3d(op2.lf + " :");
        agregar3d("if( " + txor + " == 0 )goto " + lv + " ;");
        agregar3d("goto " + lf + " ;");
        res.tipo = Const.tbool;
        res.lv.push(lv);
        res.lf.push(lf);
      }
      else
      {//error estos valores no se pueden operar
        er = {
          tipo: "Error Semantico",
          descripcion: "No se pudo operar [" + getTipo(op1.tipo) + " ] " + operador + " [" + getTipo(op2.tipo) + " ]",
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
    codigo = "if( 1 == 1 )goto " + lv +" ; \ngoto " + lf + " ;";
  else
    codigo = "if( 1 == 0 )goto " + lv +" ; \ngoto " + lf + " ;";
  agregar3d(codigo);
  return { temp: "tx", tipo : Const.tbool, lv : [lv], lf : [lf] };
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
    case "num" : return Const.tnum;
    case "str" : return Const.tstr;
    case Const.bool: return Const.tbool;
    case "void" : return Const.tvoid;
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
        agregar3d(tempRef + " = " + variable.temp + " + " + variable.variable.pos + " ;");
      } else {
        resid.esGlobal = true;
        agregar3d("//se obtiene la referencia a la variable global [" + valor.hijos[0] + "]");
        agregar3d(tempRef + " = " + variable.variable.pos + " ;");
      }
      resid.tempRef = tempRef;
      resid.tipo = variable.variable.tipo;
      resid.tipoElemento = variable.variable.tipoElemento;
      if(valor.hijos.length >= 2){
        tempVal = getTemp();
        if(variable.variable.ambito !== "global"){
          agregar3d("//se obtiene el valor en la pila de la variable [" + valor.hijos[0] + "]");
          agregar3d(tempVal + " = stack [ " + tempRef + " ] ;");
        } else {
          resid.esGlobal = true;
          agregar3d("//se obtiene el valor en el heap de la variable global [" + valor.hijos[0] + "]");
          agregar3d(tempVal + " = heap [ " + tempRef + " ] ;");
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
              agregar3d(tempVal + " = heap [ " + temp3 + " ] ;");
            }
            var temp3 = getTemp();
            agregar3d("//se obtiene la posicion de [" + valor.hijos[cont] + "] dentro del Element [" + resid.tipoElemento + "]");
            agregar3d(temp3 + " = " + tempVal + " + " + atr.pos + " ;");
            tempRef = temp3;
            resid.tempRef = tempRef;
            resid.tipo = atr.tipo;
            resid.tipoElemento = atr.tipoElemento;
            resid.esGlobal = false;
          } else {
            er = {
              tipo: "Error Semantico",
              descripcion: "El atributo [" + valor.hijos[cont] + "] no existe dentro del Element [" + resid.tipoElemento + " ]",
              fila: 0,
              columna: 0
            };
            agregarError(er);
          }
        } else {
          er = {
            tipo: "Error Semantico",
            descripcion: "El ELEMENT [" + resid.tipoElemento + " ] no ha sido declarado",
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
        descripcion: "La variable [" + valor.hijos[0] + " ] no ha sido declarada",
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

function concatenarCadenas(op1, op2, t) {
  var amb = buscarAmbito(tabla[0], ambito.join("#"));
  var tempSim = getTemp();
  agregar3d("//se inicia la concatenacion");
  agregar3d(tempSim + " = p + " + amb.tam + " ;");
  agregar3d("//se manda de parametro la primer cadena");
  agregar3d(t + " = " + tempSim + " + 1 ;");
  agregar3d("stack [ " + t + " ] = " + op1.temp + " ;");
  t = getTemp();
  agregar3d("//se manda de parametro la segunda cadena");
  agregar3d(t + " = " + tempSim + " + 2 ;");
  agregar3d("stack [ " + t + " ] = " + op2.temp + " ;");
  agregar3d("p = p + " + amb.tam + " ;");
  agregar3d("$$_concatenar() ;");
  t = getTemp();
  var tempRet = getTemp();
  agregar3d(t + " = p + 0 ;");
  agregar3d(tempRet + " = stack [ " + t + " ]");
  agregar3d("p = p - " + amb.tam + " ;");
  return{
    temp : tempRet,
    tipo : Const.tstr
  };
}

function construirCadenaTrueoFalse(op, t) {
  var lv = getEtq();
  var lf = getEtq();
  var lsalida = getEtq();
  agregar3d(t  + " = h ;");
  agregar3d("h = h + 1 ;");
  agregar3d("heap [ " + t + " ] = s ;");
  agregar3d("//se genera el codigo para convertir un booleano en cadena");
  agregar3d("if( " + op.temp + " == 1 )goto " + lv + " ;");
  agregar3d("goto " + lf + " ;");
  agregar3d(lv + " :");
  agregar3d("//se inicia la referecia para la cadena 'true'");
  agregar3d("//se agrego al pool el caracter 't'");
  agregar3d("pool [ s ] = " + "t".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 'r'");
  agregar3d("pool [ s ] = " + "r".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 'u'");
  agregar3d("pool [ s ] = " + "u".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 'e'");
  agregar3d("pool [ s ] = " + "e".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el final de la cadena");
  agregar3d("pool [ s ] = 0 ;");
  agregar3d("s = s + 1 ;");
  agregar3d("goto " + lsalida + " ;");
  agregar3d(lf + " :");
  agregar3d("//se inicia la referecia para la cadena 'true'");
  agregar3d("//se agrego al pool el caracter 'f'");
  agregar3d("pool [ s ] = " + "f".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 'a'");
  agregar3d("pool [ s ] = " + "a".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 'l'");
  agregar3d("pool [ s ] = " + "l".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 's'");
  agregar3d("pool [ s ] = " + "s".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el caracter 'e'");
  agregar3d("pool [ s ] = " + "e".charCodeAt(0) + " ;");
  agregar3d("s = s + 1 ;");
  agregar3d("//se agrego al pool el final de la cadena");
  agregar3d("pool [ s ] = 0 ;");
  agregar3d("s = s + 1 ;");
  agregar3d(lsalida + " :");
  return {
    temp: t,
    tipo: Const.tstr
  };
}

function concatenarNumCadena(op1, op2, tempSim) {
  var amb = buscarAmbito(tabla[0], ambito.join("#"));
  var temp = getTemp();
  var tempRet = getTemp();
  var tempVal = getTemp();
  if(op1.tipo === Const.tnum){
    agregar3d("//se inicia la convercion del numero en OP1");
    agregar3d(tempSim + " = p + " + amb.tam + " ;");
    agregar3d("//se manda de parametro el temporal con el valor de OP1");
    agregar3d(temp + " = " + tempSim + " + 1 ;");
    agregar3d("stack [ " + temp + " ] = " + op1.temp + " ;");
    agregar3d("p = p + " + amb.tam + " ;");
    agregar3d("$$_convertirNumAStr() ;");
    agregar3d(tempRet + " = p + 0 ;");
    agregar3d(tempVal + " = stack [ " + tempRet + " ] ;");
    agregar3d("p = p - " + amb.tam + " ;");
    op1 = {
      temp: tempVal,
      tipo: Const.tstr
    };
  }
  if(op2.tipo === Const.tnum){
    agregar3d("//se inicia la convercion del numero en OP2");
    agregar3d(tempSim + " = p + " + amb.tam + " ;");
    agregar3d("//se manda de parametro el temporal con el valor de OP2");
    agregar3d(temp + " = " + tempSim + " + 1 ;");
    agregar3d("stack [ " + temp + " ] = " + op2.temp + " ;");
    agregar3d("p = p + " + amb.tam + " ;");
    agregar3d("$$_convertirNumAStr() ;");
    agregar3d(tempRet + " = p + 0 ;");
    agregar3d(tempVal + " = stack [ " + tempRet + " ] ;");
    agregar3d("p = p - " + amb.tam + " ;");
    op2 = {
      temp: tempVal,
      tipo: Const.tstr
    };
  }
  return concatenarCadenas(op1, op2, getTemp());
}

function recolectarNombres(lid) {
  var variable = buscarVariable(lid.hijos[0]);
  var amb = buscarAmbito(tabla[0], "global#" + variable.variable.tipoElemento);
  var nombreRet = amb.nombre;
  for (var i = 1; i < lid.hijos.length; i++) {
    variable = buscarVariableEnAmbito(amb, lid.hijos[i]);
    amb = buscarAmbito(tabla[0], variable.ambito + "#" + variable.tipoElemento);
    if(amb === null)
      amb = buscarAmbito(tabla[0], "global#" + variable.tipoElemento);
    nombreRet = amb.nombre;
  }
  //alert(nombreRet);
  return nombreRet;
}
