var ejecutable = [];
var temporales = [];
var stack = [];
var heap = [];
var pool = [];
var p = 0;
var s = 0;
var h = 0;
var velocidad = 1000;
var estaDetenido = true;
var siguiente = false;
var codigoSeparado;
function reiniciarRecorrido() {
  ejecutable = [];
  temporales = [];
  stack = [];
  heap = [];
  pool = [];
  p = 0;
  s = 0;
  h = 0;
}

function obtenerEstructura3d() {
  reiniciarRecorrido();
  var inst;
  codigoSeparado = codigo3d.split("\n");
  for (var i = 0; i < codigoSeparado.length - 1; i++) {
    var separado = codigoSeparado[i].split(" ");
    var sent = codigoSeparado[i];
    if(sent.search("//") < 0){
      if (sent.search("stack") >= 0 || sent.search("heap") >= 0 || sent.search("pool") >= 0) {
        var indice = 0;
        if(sent.search("stack") >= 0)
          indice = sent.search("stack");
        if(sent.search("heap") >= 0)
          indice = sent.search("heap");
        if(sent.search("pool") >= 0)
          indice = sent.search("pool");
        if(indice < sent.indexOf(" = ")){
          inst = { detener: true, accion: Const.ASIGNACIONST, fila: i, d1: separado[0], d2: separado[2], d3: separado[5], op: "" };
        } else {
          inst = { detener: true, accion: Const.ASIGNACIONTS, fila: i, d1: separado[0], d2: separado[2], d3: separado[4], op: "" };
        }
      } else if (sent.search(" = ") >= 0) {
        if (separado.length === 6) {
          inst = { detener: true, accion: Const.ASIGNACIONTOT, fila: i, d1: separado[0], d2: separado[2], d3: separado[4], op: separado[3] };
        } else {
          inst = { detener: true, accion: Const.ASIGNACIONTT, fila: i, d1: separado[0], d2: separado[2], d3: "", op: "" };
        }
      } else if (sent.search(Const._if) >= 0) {
        inst = { detener: true, accion: Const._if, fila: i, d1: separado[1], d2: separado[3], d3: separado[5], op: separado[2] };
      } else if (sent.search(Const._goto) >= 0) {
        inst = { detener: true, accion: Const._goto, fila: i, d1: separado[1], d2: "", d3: "", op: "" };
      } else if (sent.search(Const._void) >= 0) {
        inst = { detener: false, accion: Const._void, fila: i, d1: separado[1], d2: "", d3: "", op: "" };
      } else if (sent.search('L') >= 0) {
        inst = { detener: true, accion: Const.etiqueta, fila: i, d1: separado[0], d2: "", d3: "", op: "" };
      } else if (sent.search('}') >= 0) {
        inst = { detener: true, accion: Const.finMetodo, fila: i, d1: "", d2: "", d3: "", op: "" };
      } else if (sent.search("();") >= 0) {
        inst = { detener: true, accion: Const.LLAMADO, fila: i, d1: "", d2: "", d3: "", op: "" };
      }
      ejecutable.push(inst);
    } else {
      inst = { detener: false, accion: "Comentario", fila: i, d1: "", d2: "", d3: "", op: "" };
    }
  }
  return ejecutable;
}

function recorrerEjecutable(nombre) {
  var pos = -1;
  for (var posPrin = 0; posPrin < ejecutable.length; posPrin++) {
    if (ejecutable[posPrin].accion === Const._void && ejecutable[posPrin].d1 === nombre) {
      pos = posPrin;
      break;
    }
  }
  if(pos !== -1)
  {
    var p = {pos: pos};
    var f = function(){
      if (!estaDetenido) {
        ejecutarSentencia(p);
      } else if (siguiente) {
        ejecutarSentencia(p);
        siguiente = false;
      }
      clearInterval(t);
      t = setInterval(f, velocidad);
    };
    var t = setInterval(f, velocidad);
  } else {
    alert("El metodo Principal no esta definido");
  }
}

function ejecutarSentencia(p) {
  if (p.pos <  ejecutable.length && ejecutable[p.pos].accion !== Const.finMetodo) {
    ejecutar3d(ejecutable[p.pos], p);
  }
}

function ejecutar3d(sent, pos) {
  var val1 = 0;
  var val2 = 0;
  switch (sent.accion) {
    case Const.ASIGNACIONTOT:
      //t1(d1) = t2(d2) op(op) t3(d3) ;
      val1 = getTemporal(sent.d2);
      val2 = getTemporal(sent.d3);
      switch (sent.op) {
        case "+":
          setTemporal(sent.d1, Math.round((val1 + val2) * 10000) / 10000);
          break;
        case "-":
          setTemporal(sent.d1, Math.round((val1 - val2) * 10000) / 10000);
          break;
        case "*":
          setTemporal(sent.d1, Math.round((val1 * val2) * 10000) / 10000);
          break;
        case "/":
          setTemporal(sent.d1, Math.round((val1 / val2) * 10000) / 10000);
          break;
        case "%":
          setTemporal(sent.d1, Math.round((val1 % val2) * 10000) / 10000);
          break;
        case "^":
          setTemporal(sent.d1, Math.round(Math.pow(val1,val2) * 10000) / 10000);
          break;
      }
      break;
    case Const.ASIGNACIONST:
      //stack(d1) [ t1(d2) ] = t2(d3) ;
      val1 = getTemporal(sent.d2); // posicion
      val2 = getTemporal(sent.d3); // valor
      setEstructura(sent.d1, val1, val2);
      break;
    case Const.ASIGNACIONTT:
      //t1(d1) = t2(d2) ;
      val1 = getTemporal(sent.d2);
      setTemporal(sent.d1, val1);
      break;
    case Const.ASIGNACIONTS:
      //t1(d1) = stack(d2) [ t2(d3) ] ;
      val1 = getTemporal(sent.d3);
      val2 = getEstructura(sent.d2, val1);
      setTemporal(sent.d1, val2);
      break;
    case Const._goto:
      pos.pos = buscarEtiqueta(sent.d1);
      break;
    case Const._if:
      val1 = getTemporal(sent.d1);
      val2 = getTemporal(sent.d2);
      switch (sent.op) {
        case "<":
          if(val1 < val2)
            pos.pos = buscarEtiqueta(sent.d3);
          break;
        case ">":
          if(val1 > val2)
            pos.pos = buscarEtiqueta(sent.d3);
          break;
        case "<=":
          if(val1 <= val2)
            pos.pos = buscarEtiqueta(sent.d3);
          break;
        case ">=":
          if(val1 >= val2)
            pos.pos = buscarEtiqueta(sent.d3);
          break;
        case "==":
          if(val1 == val2)
            pos.pos = buscarEtiqueta(sent.d3);
          break;
        case "!=":
          if(val1 != val2)
            pos.pos = buscarEtiqueta(sent.d3);
          break;
      }
      break;
    case Const.LLAMADO:
      break;
  }
  pos.pos++;
  actualizarTablas();
  mostrarCodigo3d(pos.pos);
}
