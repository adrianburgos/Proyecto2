function ejecutarArbolGeneral(raiz) {
  for (var i = 0; i < raiz.hijos.length; i++) {
    var hijo = raiz.hijos[i];
    switch (hijo.nombre) {
      case Const.PRINCIPAL:
        amb3D.push(Const.PRINCIPAL);
        agregar3d("Principal(){");
        ejecutarArbol(hijo.hijos[0]);
        agregar3d("}");
        ambito.pop();
        break;
      case Const.ELEMENT:
        //TODO : hay que crear los metodos de init y el constructor del ELEMENT
        break;
      case Const.DECVAR:
        
        break;
      case Const.FUNCION:

        break;
      default:

    }
  }
}
