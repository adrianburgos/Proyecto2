var codigo3d = "";
var temp = 0;
var etq = 0;

function reiniciar3d() {
	temp = 0;
	etq = 0;
	codigo3d = "";
}

function getTemp() {
	temp++;
	return "t" + temp;
}

function getEtq() {
	etq++;
	return "L" + etq;
}

function agregar3d(codigo) {
	codigo3d += codigo + "\n";
}

function agregar3dTOT(d1, d2, d3, op) {
	agregar3d(d1 + " = " + d2 + " " + op + " " + d3 + " ;");
}

function agregar3dTT(d1 , d2) {
	agregar3d(d1 + " = " + d2 + " ;");
}

function agregar3dST(d1, d2, d3) {
	agregar3d(d1 + " [ " + d2 + " ] = " + d3 + " ;");
}

function agregar3dTS(d1, d2, d3) {
	agregar3d(d1 + " = " + d2 + " [ " + d3 + " ] ;");
}

function agregar3dEtq(etq) {
	agregar3d(etq + " :");
}

function agregar3dGoto(etq) {
	agregar3d("goto " + etq + " ;");
}
