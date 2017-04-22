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