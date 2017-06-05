var logop = [];
var funciones = [];
var ejecutableop = [];
var contBloques = 0;
var codigo3dop = "";
var htmlLog = "";
/*
log = {
  fila: "",
  accion: ""
}
*/
function optimizar3d(codigo3d) {
  ejecutableop = obtenerEstructura3d(codigo3d);
  flujoDeControl(ejecutableop);
  var i = 0;
  while(i < ejecutableop.length) {
    if(ejecutableop[i].accion === Const._void){
      i = generarBloques(i);
    }
    i++;
  }
  console.log(funciones);
  optimizarFunciones();
}

function flujoDeControl(ejecutableop) {
  for (var i = 0; i < ejecutableop.length; i++) {
    if(ejecutableop[i].accion === Const._goto){
      var pos = buscarEtiqueta(ejecutableop[i].d1);
      pos++;
      if(ejecutableop[pos].accion === Const._goto){
        var l = {
          original: "goto " + ejecutableop[i].d1,
          optimizado: "goto " + ejecutableop[pos].d1,
          reglas:["Regla #17"],
          bloque: "Flujo de control"
        };
        ejecutableop[i].d1 = ejecutableop[pos].d1;
        logop.push(l);
      }
    }
  }
}

function generarBloques(pos) {
  var func = {
    id: ejecutableop[pos].d1, bloques: []
  };
  pos++;
  contBloques++;
  var bloque = {
    id: "B" + contBloques,
    hijos: []
  };
  while (ejecutableop[pos].accion !== Const.finMetodo) {
    bloque.hijos.push(ejecutableop[pos]);
    if(ejecutableop[pos].accion === Const._if || ejecutableop[pos].accion === Const._goto)
    {
      func.bloques.push(bloque);
      contBloques++;
      bloque = {
        id: "B" + contBloques,
        hijos: []
      };
    }
    pos++;
  }
  func.bloques.push(bloque);
  funciones.push(func);
  return pos;
}

function optimizarFunciones() {
  for (var i = 0; i < funciones.length; i++) {
    var cad = "";
    for (var j = 0; j < funciones[i].bloques.length; j++) {
      optimizarBloque(funciones[i].bloques[j]);
      cad += recorrerBloque(funciones[i].bloques[j]);
    }
    codigo3dop += "void " + funciones[i].id + "\n" + cad + "}\n";
  }
  console.log(codigo3dop);
  $("#taOptimizado").val(codigo3dop);
  localStorage["codigo3d"] = codigo3dop;
}

function optimizarBloque(bloque) {
  var l = {original: recorrerBloque(bloque), optimizado: "", reglas: [], bloque:bloque.id};
  aplicarR1(bloque, l);
  aplicarR3(bloque, l);
  aplicarR4(bloque, l);
  aplicarR5(bloque, l);
  aplicarR6(bloque, l);
  aplicarR7(bloque, l);
  aplicarR8(bloque, l);
  aplicarR9(bloque, l);
  aplicarR11(bloque, l);
  aplicarR12(bloque, l);
  aplicarR13(bloque, l);
  aplicarR14(bloque, l);
  aplicarR15(bloque, l);
  aplicarR16(bloque, l);
  l.optimizado = recorrerBloque(bloque);
  if(l.original !== l.optimizado)
    logop.push(l);
}

function aplicarR1(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      var posSubExp = -1;
      for (var j = i+1; j < bloque.hijos.length; j++) {
        var actual = bloque.hijos[j];
        if(actual.accion === Const.ASIGNACIONTOT){
          if (inicial.d2 === actual.d2 && inicial.op === actual.op && inicial.d3 === actual.d3) {
            posSubExp = j;
            break;
          }
        }
      }
      if(posSubExp !== -1)
      {//existe subexpresion
        var t1 = seUso(inicial.d2, i, posSubExp, bloque);
        var t2 = seUso(inicial.d3, i, posSubExp, bloque);
        if(!t1 && !t2){
          bloque.hijos[posSubExp].accion = Const.ASIGNACIONTT;
          bloque.hijos[posSubExp].d2 = inicial.d1;
          bloque.hijos[posSubExp].d3 = "";
          bloque.hijos[posSubExp].op = "";
          i--;
          l.reglas.push("Regla #1");
        }
      }
    }
    i++;
  }
}

function aplicarR3(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d1 === inicial.d2 || inicial.d1 === inicial.d3)
      if ((inicial.d2 === "0" || inicial.d3 === "0") && inicial.op === "+") {
        bloque.hijos[i].accion = "comentario";
        l.reglas.push("Regla #3");
      }
    }
    i++;
  }
}

function aplicarR4(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d1 === inicial.d2 && inicial.d3 === "0" && inicial.op === "-") {
        bloque.hijos[i].accion = "comentario";
        l.reglas.push("Regla #4");
      }
    }
    i++;
  }
}

function aplicarR5(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d1 === inicial.d2 || inicial.d1 === inicial.d3)
      if ((inicial.d2 === "1" || inicial.d3 === "1") && inicial.op === "*") {
        bloque.hijos[i].accion = "comentario";
        l.reglas.push("Regla #5");
      }
    }
    i++;
  }
}

function aplicarR6(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d1 === inicial.d2 && inicial.d3 === "1" && inicial.op === "/") {
        bloque.hijos[i].accion = "comentario";
        l.reglas.push("Regla #6");
      }
    }
    i++;
  }
}

function aplicarR7(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "0" && inicial.op === "+") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #7");
      }
      if (inicial.d2 === "0" && inicial.op === "+") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d3;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #7");
      }
    }
    i++;
  }
}

function aplicarR8(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "0" && inicial.op === "-") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #8");
      }
    }
    i++;
  }
}

function aplicarR9(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "1" && inicial.op === "*") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #9");
      }
      if (inicial.d2 === "1" && inicial.op === "*") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d3;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #9");
      }
    }
    i++;
  }
}

function aplicarR10(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "0" && inicial.op === "*") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = "0";
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #10");
      }
      if (inicial.d2 === "0" && inicial.op === "*") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = "0";
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #10");
      }
    }
    i++;
  }
}

function aplicarR11(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "1" && inicial.op === "/") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #11");
      }
    }
    i++;
  }
}

function aplicarR12(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d2 === "0" && inicial.op === "/") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = "0";
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #12");
      }
    }
    i++;
  }
}

function aplicarR13(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "0" && inicial.op === "^") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = "1";
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #13");
      }
    }
    i++;
  }
}

function aplicarR14(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "1" && inicial.op === "^") {
        bloque.hijos[i].accion = Const.ASIGNACIONTT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = "";
        bloque.hijos[i].op = "";
        l.reglas.push("Regla #14");
      }
    }
    i++;
  }
}

function aplicarR15(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "2" && inicial.op === "^") {
        bloque.hijos[i].accion = Const.ASIGNACIONTOT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = inicial.d2;
        bloque.hijos[i].op = "*";
        l.reglas.push("Regla #15");
      }
    }
    i++;
  }
}

function aplicarR16(bloque, l) {
  var i = 0;
  while (i < bloque.hijos.length) {
    var inicial = bloque.hijos[i];
    if(inicial.accion === Const.ASIGNACIONTOT){
      if (inicial.d3 === "2" && inicial.op === "*") {
        bloque.hijos[i].accion = Const.ASIGNACIONTOT;
        bloque.hijos[i].d2 = inicial.d2;
        bloque.hijos[i].d3 = inicial.d2;
        bloque.hijos[i].op = "+";
        l.reglas.push("Regla #16");
      }
    }
    i++;
  }
}

function seUso(nombre, inicio, fin, bloque) {
  for (var i = inicio; i < fin; i++) {
    var sent = bloque.hijos[i];
    if ((sent.accion === Const.ASIGNACIONTOT || sent.accion === Const.ASIGNACIONTT || sent.accion === Const.ASIGNACIONTS) && sent.d1 === nombre) {
      return true;
    }
  }
  return false;
}

function recorrerBloque(bloque) {
  var res = "";
  for (var i = 0; i < bloque.hijos.length; i++) {
    var sent = bloque.hijos[i];
    switch (sent.accion) {
      case Const.ASIGNACIONTOT:
        //t1(d1) = t2(d2) op(op) t3(d3) ;
        res += sent.d1 + " = " + sent.d2 + " " + sent.op + " " + sent.d3 + " ;\n";
        break;
      case Const.ASIGNACIONST:
        //stack(d1) [ t1(d2) ] = t2(d3) ;
        res += sent.d1 + " [ " + sent.d2 + " ] = " + sent.d3 + " ;\n";
        break;
      case Const.ASIGNACIONTT:
        //t1(d1) = t2(d2) ;
        res += sent.d1 + " = " + sent.d2 + " ;\n";
        break;
      case Const.ASIGNACIONTS:
        //t1(d1) = stack(d2) [ t2(d3) ] ;
        res += sent.d1 + " = " + sent.d2 + " [ " + sent.d3 + " ] ;\n";
        break;
      case Const._goto:
        res += "goto " + sent.d1 + " ;\n";
        break;
      case Const._if:
        res += "if( " + sent.d1 + " " + sent.op + " " + sent.d2 + " )goto " + sent.d3 + " ;\n";
        break;
      case Const.LLAMADO:
        res += sent.d1 + " ;\n";
        break;
      case Const.EXIT:
        break;
      case Const.printf:
        res += "printf ( " + sent.d1 + " , " + sent.d2 + " ) ;\n";
        break;
      case Const.prompt:
        res += "prompt ( " + sent.d1 + " , " + sent.d2 + " , " + sent.d3 + " ) ;\n";
        break;
      case Const.EXIT:
        res += "exit ( " + sent.d1 + " ) ;\n";
        break;
      case Const.etiqueta:
        res += sent.d1 + " :\n";
        break;
    }
  }
  return res;
}

function generarLog(){
	htmlLog = "";
	tablaLog();
  localStorage["tablaLog"] = htmlLog;
}

function tablaLog() {
  for (var i = 0; i < logop.length; i++) {
		htmlLog += "<tr>";
		htmlLog += "<td> " + logop[i].original.split("\n").join("&nbsp") +" </td>" +
		"<td>" + logop[i].optimizado + "</td>" +
		"<td>" + logop[i].reglas.join("\n") + "</td>" +
		"<td>" + logop[i].bloque + "</td>";
		htmlLog += "</tr>\n";
	}
}
