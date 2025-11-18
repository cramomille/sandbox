/*
	Fonctionnement : sélectionner les éléments à remplacer par un symbole puis exécuter ce script
*/

#target illustrator

function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// création d'un symbole pour le remplacement
var pathItem = activeDocument.pathItems.ellipse(0, 0, 5, 5);
var symbol = activeDocument.symbols.add(pathItem);
symbol.name = uuidv4();

// remplacement de tous les éléments sélectionnés par ce symbole
var selection = activeDocument.selection;
for(var i = selection.length - 1; i >= 0; i--) {
	var item = selection[i];
	if(item.hasOwnProperty('position')) {
		var layer = item.parent;
		var symbolItem = layer.symbolItems.add(symbol);
		symbolItem.left = item.left + item.width / 2 - symbolItem.width / 2;
		symbolItem.top = item.top - item.height / 2 + symbolItem.height / 2;
	}

	item.remove();
}
