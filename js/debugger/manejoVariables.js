function buscarEtiqueta(etq) {
  for (var i = 0; i < ejecutable.length; i++) {
    if (ejecutable[i].accion === Const.etiqueta && ejecutable[i].d1 === etq) {
      return i;
    }
  }
}

function setEstructura(estructura, pos, valor) {
  var tam = 0;
  switch (estructura) {
    case "stack":
      if(stack.length < pos){
        tam = stack.length;
        for (var i = 0; i < pos - tam; i++)
          stack.push(-501788630);
      }
      stack[pos] = valor;
      break;
    case "heap":
      if(heap.length < pos){
        tam = heap.length;
        for (var j = 0; j < pos - tam; j++)
          heap.push(-501788630);
      }
      heap[pos] = valor;
      break;
    case "pool":
      if(pool.length < pos){
        tam = pool.length;
        for (var k = 0; k < pos - tam; k++)
          pool.push(-501788630);
      }
      pool[pos] = valor;
      break;
  }
}

function getEstructura(estructura, pos) {
  switch (estructura) {
    case "stack":
      return stack[pos];
    case "heap":
      return heap[pos];
    case "pool":
      return pool[pos];
  }
}

function setTemporal(temp, valor) {
  var esta = false;
  var tam = 0;
  switch (temp) {
    case "p":
      tam = stack.length;
      for (var j = 0; j < valor - tam; j++)
        stack.push(-501788630);
      p = valor;
      esta = true;
      break;
    case "h":
      tam = heap.length;
      for (var k = 0; k < valor - tam; k++)
        heap.push(-501788630);
      h = valor;
      esta = true;
      break;
    case "s":
      tam = pool.length;
      for (var jj = 0; jj < valor - tam; jj++)
        pool.push(-501788630);
      s = valor;
      esta = true;
      break;
  }
  for (var i = 0; i < temporales.length; i++) {
    if(temporales[i].temp === temp)
    {
      esta = true;
      temporales[i].valor = valor;
    }
  }
  if (!esta) {
    temporales.push({
      temp: temp,
      valor: valor
    });
  }
}

function getTemporal(temp) {
  switch (temp) {
    case "p":
      return p;
    case "h":
      return h;
    case "s":
      return s;
  }
  if(temp.search("t") >= 0){
    for (var i = 0; i < temporales.length; i++) {
      if(temporales[i].temp === temp)
        return temporales[i].valor;
    }
  }
  return Number(temp);
}

function actualizarTablas() {
  actualizarStack();
  actualizarHeap();
  actualizarPool();
}

function actualizarStack() {
  var html = "<table class='table table-hover' id='tablaStack'>" +
  "<tr class='active'>" +
  "<th><h5>Stack</h5></th>" +
  "<th><h2>P = " + p +"</h2></th>" +
  "</tr>";
  for (var i = 0; i < stack.length; i++) {
    html += "<tr>" +
      "<td>" + i + "</td>" +
      "<td>" + stack[i] + "</td>" +
      "</tr>";
  }
  html += "</table>";
  $("#tablaStack").html(html);
}

function actualizarHeap() {
  var html = "<table class='table table-hover' id='tablaHeap'>" +
  "<tr class='active'>" +
  "<th><h5>Heap</h5></th>" +
  "<th><h2>H = " + h +"</h2></th>" +
  "</tr>";
  for (var i = 0; i < heap.length; i++) {
    html += "<tr>" +
      "<td>" + i + "</td>" +
      "<td>" + heap[i] + "</td>" +
      "</tr>";
  }
  html += "</table>";
  $("#tablaHeap").html(html);
}

function actualizarPool() {
  var html = "<table class='table table-hover' id='tablaPool'>" +
  "<tr class='active'>" +
  "<th><h5>Pool</h5></th>" +
  "<th><h2>S = " + s +"</h2></th>" +
  "</tr>";
  //104 105 115
  var inicio = true;
  for (var i = 0; i < pool.length; i++) {
    if(inicio){
      html += "<tr>";
      html += "<td>" + i + "</td>";
      html += "<td>";
      inicio = false;
    }
    if(pool[i] !== 0)
    {
      html += String.fromCharCode(pool[i]);
    } else {
      inicio = true;
      html += "</td>";
      html += "</tr>";
    }
  }
  html += "</table>";
  $("#tablaPool").html(html);
}
