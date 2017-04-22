function buscarPrincipal(raiz) {
  for (var i = 0; i < raiz.hijos.length; i++) {
    if(raiz.hijos[i].nombre === "PRINCIPAL")
      return raiz.hijos[i];
  }
  return null;
}

function ejecutarArbol(nodo) {
  var cuerpo = nodo.hijos[0];
  console.log("ejecutarArbol");
  console.log(cuerpo);
  for (var i = 0; i < cuerpo.hijos.length; i++) {
    console.log("hijo[" + i + "]");
    console.log(cuerpo.hijos[i]);
    switch(cuerpo.hijos[i].nombre)
    {
      case "ASIGNACION":
        console.log("ASIGNACION");
        var asig = cuerpo.hijos[i];
        var val = evaluarValor(asig.hijos[1]);
        console.log("el temporal de expresion es: " + val.temp);
        break;
    }
  }
}

function evaluarValor(valor) {
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
      break;
    case "-":
      var op1 = evaluarValor(valor.hijos[0]);
      var op2 = ""
      var codigo = "";
      var t = getTemp();
      if(valor.hijos.length == 1)
        codigo = t + " = -" + op1 + ";";
      else
      {
        op2 = evaluarValor(valor.hijos[1]);
        codigo = t + " = " + op1 + " " + valor.nombre + " " + op2 + ";";
      }
      agregar3d(codigo);
      return t;
      break;
    case "numero":
        return {
          temp : valor.valor,
          tipo : 1
        };
      break;
    case "boolean":
        if (valor.valor == "true")
          return {
            temp : "1",
            tipo : 3
          };
        else
          return {
            temp : "0",
            tipo : 3
          };
      break;
  }
}

function ejecutarAritmetica(op1, op2, operador) {
  var res = {temp : "", tipo : -1};
  switch(operador)
  {
    case "+":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero + numero
        case 4://numero + bool
        case 6://bool + bool
          var t = getTemp();
          var codigo = t + " = " + op1.temp + " + " + op2.temp + ";";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = 1;
          break;
      }
      break;
    case "*":
      switch(op1.tipo + op2.tipo)
      {
        case 2://numero + numero
        case 4://numero + bool
        case 6://bool + bool
          var t = getTemp();
          var codigo = t + " = " + op1.temp + " + " + op2.temp + ";";
          agregar3d(codigo);
          res.temp = t;
          res.tipo = 1;
          break;
      }
      break;
  }
  return res;
}