var consola = "";
function mostrarCodigo3d(pos) {
  var sent = ejecutable[pos];
  var ini = 0;
  var fin = codigoSeparado.length - 1;
  if(sent.fila - 5 >= 0){
    ini = sent.fila - 5;
  }
  if (sent.fila + 5 <= codigoSeparado.length - 1) {
    fin = sent.fila + 5;
  }
  var html = "<table class='table ' id='tablaCodigo'>";
  for (var i = ini; i < fin; i++){
    if (i === sent.fila) {
      html += "<tr class='info'>";
    } else {
      html += "<tr>";
    }
    html += "<td>" + codigoSeparado[i] + "</td> </tr>";
  }
  html += "</table>";
  $("#tablaCodigo").html(html);
}

function mostrarConsola() {
  $("#taConsola").val = consola;
}

function agregarConsola(texto) {
  consola += texto + "\n";
}
