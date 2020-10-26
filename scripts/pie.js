// Pie Diagram in Adobe Illustrator

#include "interface.js";
#include "utils.js";
#include "pie_functions.js";

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
    var feature = pieInterface(Columns);
    var initial_angle = feature[3];
    for (i=1; i<fileArray.length; i++){
      Percentage.push(fileArray[i][getIndex(Columns, feature[1])]);
      Texts.push(fileArray[i][getIndex(Columns, feature[0])]);
  }
}

dict = SumUnique(Texts, Percentage);
texts = getUnique(Texts);
values = new Array();
for (var _text in texts){
  values.push(dict[texts[_text]])
}
sections = ScaleArray(values, 360);
fineness = 45;
NewLayer('Parts');
NewLayer('Texts');

for (_section=0; _section < sections.length; _section++){
  makeSector(initial_angle, sections[_section], _section, 'Parts');
  initial_angle = initial_angle + sections[_section];
  var Text = doc.layers.getByName('Texts').textFrames.add();
  Text.contents = texts[_section].toUpperCase() + '\n' + Math.round(sections[_section] / 3.6).toString() + '%';
  textApp(Text, 30, [100, 100, 100]);
  distribute(Text, initial_angle - (.5 * sections[_section]), .87 * radius, Text.width);

}
if (feature[2] == false){
  makeDonut('Parts', center);
}
