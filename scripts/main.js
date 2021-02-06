#include "circular_relationship_diagram.js"
#include "interface.js";
#include "pie.js";
#include "barplot.js";
#include "scatterplot.js";
#include "utils.js";


if (isOSX())
{
    var csvFile = File.openDialog('Choose your csv', function (f) { return (f instanceof Folder) || f.name.match(/\.csv$/i);} );
} else
{
    var csvFile = File.openDialog('Choose your csv','comma-separated-values(*.csv):*.csv;');
}
init = startup();

var config = {doc: init[0],
              image_size: init[1],
              dir: "../assets/icons",
              center: getDocCenter(),
              margin: 100,
              radius: Math.round((init[1] / 2) - 100),  // TODO: find how to write this.margin
              small_radius: 8,
            }

var feature = diagramInterface();
if (feature != 0) {
   call_diagram(feature, config, csvFile)
}
