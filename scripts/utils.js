////////////////////////////////////////////////////////////////////////////////
// Graphical functions

function NewLayer(_name){
  /* Creates a new layer
     Input: new layer's name, str
  */
  itemLayer = app.activeDocument.layers.add();
  itemLayer.name = _name.toString();
}

function getArrayFromColor(Color){
  if (Color.typename == 'RGBColor') {
    return [Color.red, Color.green, Color.blue]
  }
  else if (Color.typename == 'CMYKColor') {
    return [Color.cyan, Color.magenta, Color.yellow, Color.black]
  }
}

function makeColor(colorArray){
  /* Function that creates a color object (CMYK or RGB).
   * Input: colorArray     color values, array (ch, ch, ch [, ch])
   * Returns: color, ColorObject
   */
  if (colorArray.length > 3){
    // if the Color given is CMYK
    Color = new CMYKColor();
    Color.black = colorArray[3];
    Color.cyan = colorArray[0];
    Color.yellow = colorArray[2];
    Color.magenta = colorArray[1];
  }
  else if (colorArray.length == 3) {
    // if the Color given is RGB
    Color = new RGBColor();
    Color.red = colorArray[0];
    Color.green = colorArray[1];
    Color.blue = colorArray[2];
  }
  return Color
}

function lineApp(_obj){
  /* Defines line's appearance to keep all in one style.
     Input: _obj           pathItem object
  */
  _obj.stroked = true;  // solid stroke
  _obj.filled = false;  // no fill for lines
}

function objApp(_obj, colorArray){
  /* Defines a pathItem's appearance to keep all in one style.
   * Input: _obj           object to rotate (usually text)
   *        colorArray     color values, array (ch, ch, ch [, ch])
   */
  _obj.filled = true; // fill or no fill, bool
  _obj.fillColor = makeColor(colorArray); // fill color
  _obj.stroked = false; // stroke or no stroke, bool
}

function textApp(_text, _size, colorArray){
  /* Defines a textItem's appearance to keep all in one style.
   * Input: _text          object to transform
   *        _size          size of the text in pt, int
   *        colorArray     color values, array (ch, ch, ch [, ch])
   */
  _text.textRange.characterAttributes.textFont = textFonts.getByName("Lato-Thin"); // defines the font
  _text.textRange.characterAttributes.size = parseInt(_size); // defines the size in pt
  _text.textRange.characterAttributes.fillColor = makeColor(colorArray); // defines the array color
}

////////////////////////////////////////////////////////////////////////////////
// Illustrator pathfinder functions.

function minusFront(_pathitem, cutting_item){
  /* A function that cuts one pathItem object from another one.
   * Input:   _pathitem      object that needs to be cut, pathItem;
   *          cutting_item   the cutting object, pathItem;
   * Output:  no output.
   */
  _pathitem.closed = true;
  cutting_item.closed = true;
  _pathitem.evenodd = true;
  _pathitem.selected = true;
  cutting_item.selected = true;
  app.executeMenuCommand ('group');
  app.executeMenuCommand ('Live Pathfinder Subtract');
  app.executeMenuCommand ('expandStyle');
  app.executeMenuCommand ('ungroup');
  app.activeDocument.selection[0].selected = false;

}

function mergeShapes(_pathitem, _pathitem1){
  /* A function that merges (unites) two pathItem objects.
   * Input:   _pathitem      first object, pathItem;
   *          _pathitem1     second object, pathItem;
   * Output:  resulting merged object.
   */
  _pathitem.closed = true;
  _pathitem1.closed = true;
  _pathitem.evenodd = true;
  _pathitem.selected = true;
  _pathitem1.selected = true;
  app.executeMenuCommand ('group');
  app.executeMenuCommand ('Live Pathfinder Add');
  app.executeMenuCommand ('expandStyle');
  app.executeMenuCommand ('ungroup');
  _new_object = app.activeDocument.selection[0];
  _new_object.selected = false;
  return _new_object
}

function intersectShapes(_pathitem, _pathitem1){
  /* A function that intersects two pathItem objects.
   * Input:   _pathitem      first object, pathItem;
   *          _pathitem1     second object, pathItem;
   * Output:  resulting merged object.
   */
  _pathitem.closed = true;
  _pathitem1.closed = true;
  _pathitem.evenodd = true;
  _pathitem.selected = true;
  _pathitem1.selected = true;
  app.executeMenuCommand ('group');
  app.executeMenuCommand ('Live Pathfinder Intersect');
  app.executeMenuCommand ('expandStyle');
  app.executeMenuCommand ('ungroup');
  _new_object = app.activeDocument.selection[0];
  _new_object.selected = false;
  return _new_object
}

////////////////////////////////////////////////////////////////////////////////
// Math

function std(_array){
  /* Gets the standard deviation of the Array
   * Input: _array         array of elements, array
   * Output: _new          standard deviation, float
   */
  _new = new Array();
  var media = Sum(_array) / _array.length;
  for (_el=0;_el<_array.length; _el++){
    _new[_el] = Math.pow((_array[_el] - media), 2)
  }
  return _new
}

function scaleValues(_array, _value){
  /* Function that scales an array to a range between 0 and max value.
   * Input:      _array          array to scale
   *             value           max value to scale the array to
   * Output:     _new            scaled array
   */
  // TODO: add an option when the values are categorical.
  _new = Array();
  if ((isInt(_array[0])) | (!isNaN(parseFloat(_array[0]))))
  {
    for (_i=0; _i<_array.length; _i++){
      _array[_i] = parseFloat(_array[_i]);
    }
    var _max = getMaxOfArray(_array);
    for (_i=0; _i<_array.length; _i++){
      _new.push(Math.round(_array[_i] * _value / _max));
    }
  }
  return _new
}

function standardize(_array, tiny_rad){
  _array_c = _array.slice();
  _min = _array_c.sort(function(a, b){return a - b})[0];
  _max = _array_c.sort(function(a, b){return b - a})[0];
  for (_el=0; _el<_array.length; _el++){
    _array[_el] = Math.round((((_array[_el] - _min) / (_max - _min)) * tiny_rad / 2) + 1) * 2;
  }
  return _array;
}

function SumUnique(_array, _array1){
  /* Function that sums the elements that have same labels in the other array
   * array of unique elements.
   * Input:   _array         array that contains the text labels, Array;
   *          _array1        array with the values to be transformed, Array;
   * Output:  _new           dictionary [label: value], Dict.
   */
  _new = {};
  _labels = getUnique(_array)
  for (_label=0; _label<_labels.length;_label++){
    _new[_labels[_label]] = 0;
  }
  for (_el=0; _el<_array1.length; _el++){
    _new[_array[_el]] = _new[_array[_el]] + parseInt(_array1[_el]);
  }
  return _new
}

function ScaleArray(_array, value){
  /* Function that scales an array to a sum of max value.
   * Input:      _array          array to scale
   *             value           sum value to scale the array to
   * Output:     _new            scaled array
   */
  // TODO: add an option when the values are categorical.
  if (isInt(_array[0])){
    _new = Array();
    for (_i=0; _i<_array.length; _i++){
      _array[_i] = parseInt(_array[_i]);
    }
    _total = Sum(_array);
    // alert(_total);
    for (_i=0; _i<_array.length; _i++){
      _new.push(_array[_i] * value / _total);
    }
  }
  return _new
}
////////////////////////////////////////////////////////////////////////////////
// Technical

function startup(){
  /* Function to set correctly the start of the application.
   */
  if (app.documents.length == 0){
    image_size = 1200;
    var DocPreset = new DocumentPreset();
    DocPreset.width = image_size;
    DocPreset.height = image_size;
    var doc = documents.addDocument(DocumentColorSpace.CMYK, DocPreset);
    return [doc, image_size]
  }
  else {
    return [app.activeDocument, Math.min(app.activeDocument.width, app.activeDocument.height)]
  }
}

function getCategoriesVector(_array){
  /* Function that transforms a vector into a categorical vector with num encoding
   * Input     _array         array to transform, list
   * Output    _new           categorical array, list
   *
   */
  _unique = getUnique(_array);
  _new = Array();
  for (var i = 0; i < _array.length; i++) {
    _new.push(getIndex(_unique, _array[i]));
  }
  return _new
}

function findGrid(height, max_value){
    /* Function that calculates the grid for a diagram.
     * Input:     height          max height of an element in the diagram, px, int
     *            max_value       max value of this element, int
     * Output:    list            a list of two values, vals - list of _labels
     *                            for the grid; _grid_division - distance between
     *                            them in px, int
     */
     // TODO: add min value, so that the range could be focused only on the necessary values
     max_value = Math.round(max_value);
     _length = max_value.toString().length;
     vals = new Array();
     if (max_value.toString()[0]!="1")
     {
       for (x = 0; x <= Math.floor(max_value); x = x + Math.pow(10, (_length-1)))
       {
         vals.push(x);
       }
     }
     else {
       for (x = 0; x <= Math.floor(max_value); x = x + Math.pow(10, (_length - 2))){
         vals.push(x);
       }
     }
     _grid_division = Math.round(height * vals[1] / max_value);
     return [vals, _grid_division]
}

function placeAxis(_layer, start_coords_x, start_coords_y, config, _color){
  var axis = app.activeDocument.layers.getByName(_layer).pathItems.add();
  // Placing y axis
  coords = new Array(start_coords_y, [start_coords_y[0],
                                      config.image_size - (0.5 * config.margin)]);
  axis.setEntirePath(coords);
  axis.strokeWidth = Math.round(config.image_size / 600);
  axis.strokeColor = _color;
  var axis1 = app.activeDocument.layers.getByName(_layer).pathItems.add();
  // Placing x axis
  coords = new Array(start_coords_x, [config.image_size - config.margin,
                                      start_coords_x[1]]);
  axis1.setEntirePath(coords);
  axis1.strokeWidth = Math.round(config.image_size / 600);
  axis1.strokeColor = _color;
}




function gridNumbers(vals, step, start_coords, _layer, _color, axis, grid){
  /* Function that draws a horizontal grid on a diagram
   * Input: vals         values to be mentioned on the grid
   *        step         step between the lines and the values, int in px
   *        start_coords array of the first line coords [[x1,y1], [x2, y2]]
   *        _layer       name of the layer to place the elements on, str
   *        _color       color of the lines, Color
   *        axis         axis along which the grid is made, 0 - hor lines
   *                                                        1 - vert lines
   */
  text_size = 30;
  for (var val=0; val<vals.length; val++){
    s_coord = [start_coords[0][0], start_coords[0][1]]
    e_coord = [start_coords[1][0], start_coords[1][1]]
    s_coord[axis] += (val * step)
    e_coord[axis] += (val * step)
    if (grid == true) {
      var _line = app.activeDocument.layers.getByName(_layer).pathItems.add();
      _line.setEntirePath(Array(s_coord, e_coord));
      _line.strokeWidth = 0.25;
      _line.strokeColor = _color;
    }
    if (vals[val]!=0){
      var _text = app.activeDocument.layers.getByName(_layer).textFrames.add();
      _text.contents = 0;
      textApp(_text, text_size, getArrayFromColor(_color));
      text_margin = _text.width;
      _text.contents = vals[val];

      textApp(_text, 30, getArrayFromColor(_color));
      // if (vals[val] == 0){
      //   _text.top = Math.round(s_coord[1] + (_text.height * 1.5));
      //   _text.left = Math.round(s_coord[0] - text_margin - _text.width);
      // }

      if (axis == 0) {
        _text.top = Math.round(s_coord[1] - (_text.height * 0.5));
        _text.left = Math.round(s_coord[0] - (_text.width * 0.5));
      }
      else {
        _text.top = Math.round(s_coord[1] + (_text.height * 0.5));
        _text.left = Math.round(s_coord[0] - text_margin - _text.width);
      }
    }
  }
}

function getDocSize(){
  /* Function that gets the current document canvas size.
   */
  // artboardRect [left, top, right, bottom]
  art_ind = app.activeDocument.artboards.getActiveArtboardIndex();
  artboard_bb = app.activeDocument.artboards[art_ind].artboardRect

  return [artboard_bb[2]-artboard_bb[0], artboard_bb[3]-artboard_bb[1]]
}

function getDocCenter(){
  /* Function that gets the current document canvas center.
   */
  // artboardRect [left, top, right, bottom]
  art_ind = app.activeDocument.artboards.getActiveArtboardIndex();
  artboard_bb = app.activeDocument.artboards[art_ind].artboardRect

  return [artboard_bb[0] + ((artboard_bb[2]-artboard_bb[0]) / 2),
          artboard_bb[1]+((artboard_bb[3]-artboard_bb[1])/2)]
}

function readInCSV(fileObj){
  /* Function that parses the csv file given to it.
   * Input:     fileObj         csv file to parse
   * Output:    fileArray       array of values parsed from the csv
   */
  var fileArray = new Array();
  var district = new Array();
  fileObj.open('r');
  fileObj.seek(0, 0);
  while(!fileObj.eof)
  {
      var thisLine = fileObj.readln();
      var csvArray = thisLine.split(',');
      fileArray.push(csvArray);
  }
  fileObj.close();
  return fileArray;
}

function isOSX()
{
    return $.os.match(/Macintosh/i);
}

function getUnique(_array){
  /* Function that gets unique elements from the given array and returns a new
   * array of unique elements.
   * Input:   _array         array to extract the unique elements from, Array;
   * Output:  _array1        array that stores the unique elements, Array.
   */
  _array1 = new Array();
  // for (var _el in _array){
  for (_e=0; _e<_array.length; _e++){
    _el = _array[_e]
    var n = 0;
    // for (_el1 in _array1){
    for (_e1=0; _e1<_array1.length; _e1++){
      _el1 = _array1[_e1]
      if (_el == _el1){
        n = 1;
        break;
      }
    }
    if (n == 0){
      _array1.push(_el)
    }
  }
  return _array1
}

function isInt(value) {
  var x = parseFloat(value);
  return !isNaN(value) && (x | 0) === x;
}

function Sum(_array) {
  /* Gets the sum of the elements of a numerical Array
   * Input: _array         array of numerical elements, array
   * Output: _total        sum of all elements, float
   */
  var _total = 0;
  for (_el=0; _el<_array.length; _el++){
    _total = _total + _array[_el];
  }
  return _total;
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}

function getIndex(_array, _element){
  /* Gets an index of the passed element in the array. If not found gives an error
   * and exits the program.
   * Input: _array         array to examine, Array
   *        _element       element in the array to search for, object
   * Output: index         index of the element in the array
   */
  index = -1;

  for (var _el=0; _el<_array.length; _el++){
    if (_array[_el].indexOf(_element) > -1){ break}
      index = _el;
  }
  return index + 1
}
