// Barplot Diagram in Adobe Illustrator

// TODO: styles for diagrams
// TODO: marks 50 100 etc
// TODO: catplot and violinplot

#include "interface.js";
#include "utils.js";

d = startup();
var doc = d[0];
var image_size = d[1];
var dir = "../assets/icons";
var center = getDocCenter();
var margin = 100;
var radius = Math.round((image_size/2) - margin);

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
    var Columns = new Array();
    var Texts = new Array();
    var Percentage = new Array();
    Columns = fileArray[0];
    var feature = barInterface(Columns);
    for (i=1; i<fileArray.length; i++){
      Percentage.push(fileArray[i][getIndex(Columns, feature[1])]);
      Texts.push(fileArray[i][getIndex(Columns, feature[0])]);
  }
}
NewLayer('Diagram');
NewLayer('Parts');
NewLayer('Texts');
dict = SumUnique(Texts, Percentage);
texts = getUnique(Texts);
values = new Array();
// background
if (feature[2] != 'transparent'){
  var bgr = doc.layers.getByName('Diagram').pathItems.rectangle(0, 0, image_size,
                                                                -image_size);
  bgr.stroked = false;
  bgr.filled = true;
  if (feature[2] == 'white'){
    bgr.fillColor = makeColor([255, 255, 255]);
    diagram_color = makeColor([0, 0, 0]);
  }
  else if (feature[2] == 'gray') {
    bgr.fillColor = makeColor([200, 200, 200]);
    diagram_color = makeColor([0, 0, 0]);
  }
  else {
    bgr.fillColor = makeColor([0, 0, 0]);
    diagram_color = makeColor([255, 255, 255]);
  }
  bgr.zOrder(ZOrderMethod.SENDTOBACK);
}
// Diagram
for (var _text in texts){
  values.push(dict[texts[_text]])
}
for (_i = 0; _i < values.length; _i++){
  values[_i] = parseInt(values[_i]);
  // alert(values[_i]);
}
scaled_values = scaleValues(values, image_size - (4 * margin));
bar_width = (image_size - (3 * margin)) / scaled_values.length;
for (_value=0; _value < scaled_values.length; _value++){
  var bar = doc.layers.getByName('Parts').pathItems.rectangle(Math.round(3*margin + (scaled_values[_value])),
                                                              Math.round((2*margin) + (bar_width * _value)),
                                                              Math.round((image_size - (3*margin)) / scaled_values.length),
                                                              Math.round(scaled_values[_value]));
  var text = doc.layers.getByName('Texts').textFrames.add();
  text.contents = texts[_value].toUpperCase();
  textApp(text, 30, [100, 100, 100]);
  text.rotate(90);
  text.left = Math.round((2*margin) + (bar_width * (_value + 0.5)) - (text.width * 0.5));
  text.top = Math.round(2 * margin);
}
var axis = doc.layers.getByName('Diagram').pathItems.add();
coords = new Array([margin, 2.5 * margin], [margin, image_size - (0.5 * margin)]);
axis.setEntirePath(coords);
axis.strokeColor = diagram_color;
axis.stroke = 1;
var axis1 = doc.layers.getByName('Diagram').pathItems.add();
coords = new Array([0.5 * margin, 3 * margin], [2 * margin, 3 * margin]);
axis1.setEntirePath(coords);
axis1.strokeColor = diagram_color;
axis1.stroke = 1;


// grid
if (feature[3] == true){
  a = findGrid(getMaxOfArray(scaled_values), getMaxOfArray(values));
  start_coords = new Array([margin, 3 * margin], [Math.round(image_size - (0.5 * margin)), 3 * margin])
  makeGrid(a[0], a[1], start_coords, 'Diagram', diagram_color);
}
