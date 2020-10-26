// Pie Diagram in Adobe Illustrator

#include "interface.js";
#include "utils.js";
// #include "scatter_functions.js";

d = startup();
var doc = d[0];
var image_size = d[1];
var dir = "../assets/icons";
var center = getDocCenter();
var margin = 100;
var radius = 8;

var _x2 = 0;
var _y2 = 0;

if (isOSX())
{
    var csvFile = File.openDialog('Choose your csv', function (f) { return (f instanceof Folder) || f.name.match(/\.csv$/i);} );
} else
{
    var csvFile = File.openDialog('Choose your csv','comma-separated-values(*.csv):*.csv;');
}
if (csvFile != null){
    fileArray = readInCSV(csvFile);
    var X = new Array();
    var Y = new Array();
    var Texts = new Array();
    var Color = new Array();
    Columns = fileArray[0];
    var feature = scatterInterface(Columns);
    for (i=1; i<fileArray.length; i++){
      X.push(fileArray[i][getIndex(Columns, feature[0])]);
      Y.push(fileArray[i][getIndex(Columns, feature[1])]);
      Color.push(fileArray[i][getIndex(Columns, feature[2])]);
      // Texts.push(fileArray[i][getIndex(Columns, feature[0])]);
  }
}
bgr = feature[3];
colors = getUnique(Color);  // TODO:  Transform into color arrays
scaled_values_x = scaleValues(X, image_size - (4 * margin));
scaled_values_y = scaleValues(Y, image_size - (4 * margin));
NewLayer('Diagram');
NewLayer('Points');
for (_point=0; _point < X.length; _point++){
  var small_circle = doc.layers.getByName('Points').pathItems.ellipse((
    Math.round(2*margin + scaled_values_y[_point])+radius),
    2*margin + Math.round(scaled_values_x[_point]) - radius, 2*radius, 2*radius,
    false);
  small_circle.filled = true;
  _c = 255 * _point / (colors.length+1);
  small_circle.fillColor = makeColor([_c, _c, _c]);
  small_circle.stroked = false;
}
placeAxis('Diagram', [Math.round(1.5*margin), Math.round(2*margin)],
                     [Math.round(2*margin), Math.round(1.5*margin)], image_size);
a = findGrid(getMaxOfArray(scaled_values_x), getMaxOfArray(X));
// makeGrid(a[0], a[1], [[2*margin, 2*margin],[2*margin, 2*margin]], 'Diagram');
