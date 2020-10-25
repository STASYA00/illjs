// Importing the dependencies
#include "utils.js";
#include "interface.js";
#include "pie_functions.js";

var doc = app.activeDocument;
var area = 0;

var layers_name = new Array();
for (i=0; i<doc.layers.length; i++){
  layers_name.push(doc.layers[i].name)
}
_layers = areaInterface(layers_name);

var total_layer = doc.layers.getByName(_layers[0]);
var partial_layer = doc.layers.getByName(_layers[1]);
var area = (100 * getLayerArea(partial_layer) /
                      getLayerArea(total_layer)).toFixed(2);
NewLayer('Diagram');
var sections = [Math.round(area)];
sections.push(Math.round(100 - area));
sections = ScaleArray(sections, 360);
fineness = 45;
initial_angle = 15;
for (_section=0; _section < sections.length; _section++){
  makeSector(initial_angle, sections[_section], _section, 'Diagram');
  initial_angle = initial_angle + sections[_section];
}

////////////////////////////////////////////////////////////////////////////////

function getLayerArea(_layer){
  /* Function that counts the area of all the objects in a given layer.
   * Input:     _layer          layer to count the area of.
   * Output:    _area           area of all the objects in the layer, float
   */
  _area = 0;
  for (obj=0; obj<_layer.pathItems.length; obj++){
    _area = _area + Math.abs(_layer.pathItems[obj].area);
  }
  return _area
}
