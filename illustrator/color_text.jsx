// Cette fonction applique des regles de style a du texte dans un calque Illustrator
function colorCodeText() {
  var doc = app.activeDocument;
  var activeLayer = doc.activeLayer;
  var keywords = [
    "asf_data", 
    "asf_drom", 
    "asf_dep"
  ];

  var vio = new CMYKColor(); // caracteres entre guillemets
  vio.cyan = 50; vio.magenta = 40; vio.yellow = 0; vio.black = 0;

  var rou = new CMYKColor(); // mots-cles
  rou.cyan = 0; rou.magenta = 75; rou.yellow = 50; rou.black = 0;

  var ros = new CMYKColor(); // chiffres
  ros.cyan = 0; ros.magenta = 55; ros.yellow = 0; ros.black = 0;

  for (var i = 0; i < activeLayer.textFrames.length; i++) {
    var tf = activeLayer.textFrames[i];
    var content = tf.contents;
    var textRange = tf.textRange;

    var charColors = [];

    // Initialisation
    for (var idx = 0; idx < content.length; idx++) {
      charColors[idx] = null;
    }

    // ETAPE : guillemets
    var quoteRegex = /"[^"]*"/g;
    while ((match = quoteRegex.exec(content)) !== null) {
      for (var k = match.index; k < match.index + match[0].length; k++) {
        if (!charColors[k]) charColors[k] = vio;
      }
    }

    // ETAPE : mots-cles
    for (var kw = 0; kw < keywords.length; kw++) {
      var keyword = keywords[kw];
      var pos = content.indexOf(keyword);
      while (pos !== -1) {
        var skip = false;
        for (var k = pos; k < pos + keyword.length; k++) {
          if (charColors[k] === vio) {
            skip = true;
            break;
          }
        }
        if (!skip) {
          for (var k = pos; k < pos + keyword.length; k++) {
            if (!charColors[k]) charColors[k] = rou;
          }
        }
        pos = content.indexOf(keyword, pos + keyword.length);
      }
    }

    // ETAPE : chiffres et points entre chiffres
    for (var j = 0; j < content.length; j++) {
      var c = content.charAt(j);
      var prev = content.charAt(j - 1);
      var next = content.charAt(j + 1);

      // Ne pas recolorer si deja traite
      if (charColors[j]) continue;

      // Cas : chiffre
      if (c.match(/[0-9]/)) {
        // Verification stricte pour $ avant ou apres le chiffre
        if (prev === "$" || next === "$") {
          continue; // Ignorer si $ est adjacent
        }

        // Verifier que le chiffre n'est pas colle a une lettre
        if (prev.match(/[a-zA-Z]/) || next.match(/[a-zA-Z]/)) {
          continue; // Ignorer si une lettre est presente
        }

        // Colorier en rose si aucune condition d'exclusion n'est remplie
        charColors[j] = ros;
      }

      // Cas : point entre deux chiffres (pas concerne par $)
      if (c === '.' && prev && next && prev.match(/[0-9]/) && next.match(/[0-9]/)) {
        charColors[j] = ros;
      }
    }

    // APPLICATION DES COULEURS
    for (var k = 0; k < content.length; k++) {
      if (charColors[k]) {
        textRange.characters[k].characterAttributes.fillColor = charColors[k];
      }
    }
  }
}

colorCodeText();