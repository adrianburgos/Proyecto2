function ejecutarArbolGeneral(raiz) {
  for (var i = 0; i < raiz.hijos.length; i++) {
    var hijo = raiz.hijos[i];
    switch (hijo.nombre) {
      case Const.PRINCIPAL:
        agregar3d("//====================================================================================================================================================================================================================");
        ambito.push(Const.PRINCIPAL);
        agregar3d("Principal(){");
        ejecutarArbol(hijo.hijos[0]);
        agregar3d("}");
        ambito.pop();
        break;
      case Const.ELEMENT:
        //TODO: hay que crear los metodos de init y el constructor del ELEMENT
        break;
      case Const.DECVAR:
        decVariable(hijo);
        break;
      case Const.FUNCION:
        agregar3d("//====================================================================================================================================================================================================================");
        ambito.push(hijo.id);
        agregar3d(hijo.id + "(){");
        var cuerpo = buscarCuerpo(hijo);
        ejecutarArbol(cuerpo);
        agregar3d("}");
        ambito.pop();
        break;
      default:

    }
  }
}
