image_size = 1200;
var DocPreset = new DocumentPreset();
DocPreset.width = image_size;
DocPreset.height = image_size;
var center = Array(Math.round(image_size / 2), Math.round(image_size / 2));
var margin = 20;
var radius = Math.round((image_size / 2) - margin);
var small_rad = 16; // outer circle graphics size
var tiny_rad = 8; // inner circle graphics size
var offset = 20; // distance between the elements

var doc = documents.addDocument(DocumentColorSpace.CMYK, DocPreset);
var csvFile = '/d/Google%20Drive/Portfolio/references_for_portfolio/WORK/##/articles/small_country_dataset.csv';
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
    var Parts = new Array();
    var PartsIndices = new Array();
    var GDP = new Array();
    var Countries = new Array();
    var TinyRad = new Array();
    var WLength = 0;
    var CWLength = 0;
    // Create new layers
    NewLayer('Parts');
    NewLayer('Countries');
    NewLayer('Graphical');
    NewLayer('Graphical_small');
    NewLayer('Connections');
    Columns = fileArray[0];
    var feature = popUp(Columns);
    var connection_threshold = feature[3]; // value under which the smaples are considered
                                           // similar.
    for ( i=1; i<fileArray.length; i++){
      Parts.push(fileArray[i][getIndex(Columns, feature[0])]);
      Countries.push(fileArray[i][getIndex(Columns, feature[1])]);
      GDP.push(fileArray[i][getIndex(Columns, feature[2])]);
      if (feature.length > 4 && feature[4] != null){
        TinyRad.push(Number(fileArray[i][getIndex(Columns, feature[4])]));
      }
      else {
        TinyRad.push(tiny_rad);
      }
    }

    TinyRad = standardize(TinyRad);

    for (i=0; i< Countries.length; i++){
      var Text = doc.layers.getByName('Countries').textFrames.add();
      Text.contents = Countries[i];
      distribute(Text, i, fileArray.length, radius - offset - (WLength / 2), 0);
      CWLength = Math.max(CWLength, Text.width);

      // if ((i % 5) == 0){
      if (fileArray[i+1][getIndex(Columns, feature[0])] != fileArray[i][getIndex(Columns, feature[0])]){
        var Text = doc.layers.getByName('Parts').textFrames.add();
        Text.contents = Parts[i];
        PartsIndices.push(Parts.length - i - 1);
        distribute(Text, i, fileArray.length, radius, 0);
        WLength = Math.max(WLength, Text.width);
      }
    }
    PartsIndices = PartsIndices.reverse();
    if ((WLength + radius + margin) > (image_size / 2)){
      radius = Math.round((image_size / 2) - margin - WLength);
      center = Array(Math.round(image_size / 2),
                     Math.round(image_size / 2));
    }
    var parts_number = doc.layers.getByName('Parts').textFrames.length;
    var countries_number = doc.layers.getByName('Countries').textFrames.length;
    var inner_circle_radius = radius - offset -
                              Math.round(CWLength + (offset / 2));
    for (t=0; t < countries_number; t++){

      var Text = doc.layers.getByName('Countries').textFrames[t];
      textRotate(Text, t-2, countries_number);
      textApp(Text, [51, 43, 43, 7]);
      distribute(Text, t-2, countries_number, inner_circle_radius, 0);

      // Add a circle near each country.
      if ((t - 2) >= 0){
        _tiny_rad = TinyRad[t - 2]
      }
      else {
        _tiny_rad = TinyRad[countries_number + t - 2]
      }
      var small_ellipse = doc.layers.getByName('Graphical_small').pathItems.ellipse(0, 0,
                                                 _tiny_rad * 2,
                                                 _tiny_rad * 2,
                                                 false);
      distribute(small_ellipse, countries_number - t - 1, countries_number,
                 inner_circle_radius - offset, _tiny_rad);
      objApp(small_ellipse, [51, 43, 43, 7]);

      if (t < parts_number){
        var Text = doc.layers.getByName('Parts').textFrames[t];
        textRotate(Text, PartsIndices[t]-2, countries_number);
        textApp(Text, [68, 61, 60, 49]);
        distribute(Text, PartsIndices[t]-2, countries_number, radius, 0);

        // Add a circle near each Part
        var small_ellipse = doc.layers.getByName('Graphical').pathItems.ellipse(Math.round(center[0] + (small_rad / 2) +
                        ((radius - offset) * Math.cos((PartsIndices[t]-2) * (360/countries_number) * Math.PI / 180))),
                        Math.round(center[0] - (small_rad / 2) + ((radius - offset) *
                        Math.sin((PartsIndices[t]-2) * (360/countries_number) * Math.PI / 180))),
                                                       small_rad, small_rad, false);

        objApp(small_ellipse, [68, 61, 60, 49]);

      }
  }
  var large_ellipse = doc.layers.getByName('Graphical').pathItems.ellipse(center[0] + radius - offset,
                                                 center[1] - radius + offset,
                                                 (radius - offset) * 2,
                                                 (radius - offset) * 2, false);

  large_ellipse.filled = false;
  large_ellipse.zOrder(ZOrderMethod.SENDTOBACK);  // bring it to the back
  // Adding the countries as a second circle.
  Compare(GDP);
}

////////////////////////////////////////////////////////////////////////////////

function NewLayer(_name){
  /* Creates a new layer
     Input: new layer's name, str
  */
  itemLayer = doc.layers.add();
  itemLayer.name = _name.toString();
}

function getIndex(_array, _element){
  /* Gets an index of the passed element in the array. If not found gives an error
     and exits the program.
     Input: _array         array to examine, Array
            _element       element in the array to search for, object
     Output: index         index of the element in the array
  */
  index = -1;
  for (var _el=0; _el<_array.length; _el++){
    if (_array[_el].indexOf(_element) > -1){ break}
      index = _el;
  }
  // if (index > 0){
  //   return index
  // }
  return index + 1
  // else {
  //   alert('No such element was found in the array.', 'Error');
  //   exit();
  // }
}

function textRotate(_obj, _t, _array_length){
  /* Rotates an object to a given portion of a circle.
     Input: _obj           object to rotate (usually text)
            _t             number of a part/iteration, int
            _array_length  total fractions of a circle, int
  */
  if ((_t > _array_length * 3 / 4) || (_t < 0)){
    // operation for the top left quarter of a circle.
    _obj.rotate(-(90 + (_t * 360 / _array_length)));
  }
  else if ((_t > _array_length / 2) && (_t < _array_length * 3 / 4)){
    // operation for the bottom left quarter of a circle.
    _obj.rotate(-(90 + (_t * 360 / _array_length)));
  }
  else{
    // operation for the bottom right half of a circle.
    _obj.rotate(90 - (_t * 360 / _array_length));
  }
}

function CorrectPosition(_obj, _i, _length, _own_radius){
  /* Corrects an object's position based on the internal characteristics.
     Input: _obj           object to rotate (usually text)
            _i             number of a part/iteration, int
            _length        total fractions of a circle, int
            _own_radius    radius of the object to be assigned and used in the
                           correction; pass 0 if not applicable, int
    Output: _x             horizontal coordinate to place the object, int (pix)
            _y             vertical coordinate to place the object, int (pix)
  */
  if (_obj.typename == 'TextFrame'){
    // Texts' distribution
    // Corrections due to the non-null dimensions of the texts.
    _own_radius = 0; // Text doesn't have a radius
    if ((_i > _length * 3 / 4) || (_i < 0)){
      // operation for the top left quarter of a circle.
      _y =  Math.round(_y + _obj.height);
      _x = Math.round(_x - _obj.width);
    }
    else if (_i < _length * 1 / 4){
      // operation for the top right quarter of a circle.
      _y =  Math.round(_y + _obj.height);
    }
    else if ((_i > _length / 2) && (_i < _length * 3 / 4)) {
      // operation for the bottom left quarter of a circle.
        _x = Math.round(_x - _obj.width);
    }
  }
  else {
    // Circles' distribution
    _x = Math.round(_x - (_own_radius / 2));
    _y = Math.round(_y + (_own_radius / 2));
    _obj.width = _own_radius * 2;
    _obj.height = _own_radius * 2;
  }
  return (_x, _y)
}

function distribute(_obj, _i, _length, _radius, _own_radius){
  /* Gets object's coordinates on a circle of a given radius.
     Input: _obj           object to rotate (usually text)
            _i             number of a part/iteration, int
            _length        total fractions of a circle, int
            _radius        radius of a circle to distribute the objs around, int
            _own_radius    own radius of an object (0 if Text), int
  */
  _x = Math.round(center[1] +
                  (_radius * Math.sin(_i * (360/_length) * Math.PI / 180)));
  _y =  Math.round(center[0] +
                   (_radius * Math.cos(_i * (360/_length) * Math.PI / 180)));
  _x, _y = CorrectPosition(_obj, _i, _length, _own_radius);
  _obj.left = _x; // assigns the object's left offset in pixels
  _obj.top = _y; // assigns the object's top offset in pixels
}

function std(_array){
  _new = new Array();
  var media = Sum(_array) / _array.length;
  for (_el=0;_el<_array.length; _el++){
    _new[_el] = Math.pow((_array[_el] - media), 2)
  }
  return _new
}

function standardize(_array){
  _array_c = _array.slice();
  _min = _array_c.sort(function(a, b){return a - b})[0];
  _max = _array_c.sort(function(a, b){return b - a})[0];
  for (_el=0; _el<_array.length; _el++){
    _array[_el] = Math.round((((_array[_el] - _min) / (_max - _min)) * tiny_rad / 2) + 1) * 2;
  }
  return _array;
}

////////////////////////////////////////////////////////////////////////////////
// Graphical.

function makeColor(colorArray){
  /* Function that creates a color object.
     Input: colorArray     color values, array (ch, ch, ch [, ch])
     Returns: color, ColorObject
  */
  if (colorArray.length > 3){
    Color = new CMYKColor();
    Color.black = colorArray[3];
    Color.cyan = colorArray[0];
    Color.yellow = colorArray[2];
    Color.magenta = colorArray[1];
  }
  else if (colorArray.length == 3) {
    Color = new RGBColor();
    Color.red = colorArray[0];
    Color.green = colorArray[1];
    Color.blue = colorArray[2];
  }
  return Color
}

function Sum(_array) {
  var _total = 0;
  for (_el=0; _el < _array.length; _el++){
    _total = _total + _array[_el];
  }
  alert(_total, 'total');
  return _total;
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
     Input: _obj           object to rotate (usually text)
            colorArray     color values, array (ch, ch, ch [, ch])
  */
  _obj.filled = true; // fill or no fill, bool
  _obj.fillColor = makeColor(colorArray); // fill color
  _obj.stroked = false; // stroke or no stroke, bool
}

function textApp(_text, colorArray){
  /* Defines a textItem's appearance to keep all in one style.
     Input: _text          object to transform
            colorArray     color values, array (ch, ch, ch [, ch])
  */
  _text.textRange.characterAttributes.textFont = textFonts.getByName("Lato-Thin"); // defines the font
  _text.textRange.characterAttributes.size = 14; // defines the size in pt
  _text.textRange.characterAttributes.fillColor = makeColor(colorArray); // defines the array color
}
////////////////////////////////////////////////////////////////////////////////
function readInCSV(fileObj)
{
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


  function popUp(_array){

    /*
     * Activates the pop up window where the features are chosen.
     * Output: list [Category Column, Subcategory Column, Connection Column,
     *               Connection threshold [, size column]]
     */
    var _win = new Window("dialog", 'Choose the columns.', undefined,
                          {closeButton:false});
    _win.add('statictext', undefined, 'Outer Circle');
    var _list_outer = _win.add('dropdownlist', undefined, _array);
    _win.add('statictext', undefined, 'Inner Circle');
    var _list_inner = _win.add('dropdownlist', undefined, _array);

    var size_check = _win.add ("checkbox", undefined,
                         "Display quantitative difference in the inner circle");
    size_check.value=true;
    _win.add('statictext', undefined, 'Size feature of inner circle');
    var _list_inner_size = _win.add('dropdownlist', undefined, _array);

    var e = _win.add ("edittext", undefined, 50);
    var _slider = _win.add('slider', undefined, 500, 0, 1000);
    _slider.onChanging = function () {e.text = _slider.value;}
    e.onChanging = function () {_slider.value = e.text;}

    _win.add('statictext', undefined, 'Comparison feature');
    var _list_connect = _win.add('listbox', undefined, _array);

    var _close = _win.add('button', undefined, 'OK');
    //alert(_list.selection.constructor.name, 0);
    _win.show();
    if (size_check.value == true){
      return [_list_outer.selection.text, _list_inner.selection.text,
              _list_connect.selection.text, _slider.value,
              _list_inner_size.selection.text]
    }
    else {
      return [_list_outer.selection.text, _list_inner.selection.text,
              _list_connect.selection.text, _slider.value]
    }
    _win.close();
  }

////////////////////////////////////////////////////////////////////////////////

  function Connect(_first, _second, _note){
    /* Function that connects similar elements by feature.
       Input: _first         color values, array (ch, ch, ch [, ch])
              _second        index of the second item to connect to, int
              _note          special position of the elements, bool
                             0 - leave default
                             1 - invert the curve
    */
    var _ell1 = doc.layers.getByName('Graphical_small').pathItems[_first];
    var _ell2 = doc.layers.getByName('Graphical_small').pathItems[_second];
    _coords = [[(_ell1.left + (_ell1.width/2)),(_ell1.top - (_ell1.height/2))],
               [(_ell2.left + (_ell2.width/2)),(_ell2.top - (_ell2.height/2))]]
    var _line = doc.layers.getByName('Connections').pathItems.add();
    _line.setEntirePath(_coords);
    _line.strokeColor = _ell1.fillColor;  // same fill color as the ellipses
    setAnchors(_line, _note);  // sets the curvature of the line
    lineApp(_line);  // sets the unique line appearance as defined
  }

  function setAnchors(_line, _note){
    /* Sets the anchors of the pathPoints.
       Input: _line          line the point belongs to, pathItem object
              _note          special position of the elements, bool
                             1 - leave default
                             -1 - invert the curve
    */
    if (_line.pathPoints[0].anchor[0] > _line.pathPoints[1].anchor[0]){
      // the furtherleft point will be considered the first
      _first_p =  _line.pathPoints[1].anchor;
      _second_p = _line.pathPoints[0].anchor;
      _line.pathPoints[0].anchor = _first_p;
      _line.pathPoints[1].anchor = _second_p;
    }
    _first_p =  _line.pathPoints[0];
    _second_p = _line.pathPoints[1];

    _angle = Math.asin((_second_p.anchor[1] -
                        _first_p.anchor[1]) / _line.length);

    _first_p.pointType = PointType.SMOOTH;  // Makes the line curved
    _second_p.pointType = PointType.SMOOTH;

    _first_p.leftDirection = [_first_p.anchor[0] - (Math.cos(_angle + (_note * 0.25 * Math.PI)) * (_line.length / 4)),
                              _first_p.anchor[1] - (Math.sin(_angle + (_note * 0.25 * Math.PI)) * (_line.length / 4))];
    _first_p.rightDirection = [_first_p.anchor[0] + (Math.cos(_angle + (_note * 0.25 * Math.PI)) * (_line.length / 4)),
                               _first_p.anchor[1] + (Math.sin(_angle + (_note * 0.25 * Math.PI)) * (_line.length / 4))];
    _second_p.leftDirection = [_second_p.anchor[0] + (Math.cos(_angle + (_note * 0.75 * Math.PI)) * (_line.length / 4)),
                               _second_p.anchor[1] + (Math.sin(_angle + (_note * 0.75 * Math.PI)) * (_line.length / 4))];
    _second_p.rightDirection = [_second_p.anchor[0] - (Math.cos(_angle + (_note * 0.75 * Math.PI)) * (_line.length / 4)),
                                _second_p.anchor[1] - (Math.sin(_angle + (_note * 0.75 * Math.PI)) * (_line.length / 4))];
  }

  function Compare(_array){
    for (_first=0; _first<_array.length; _first++){
      for (_second=_first + 1; _second<_array.length; _second++){
        if (Math.abs((_array[_first] - _array[_second])) < connection_threshold){
          var _note = 1;
          if (((_first > (_array.length * 0.8)) || (_first < (_array.length * 0.2))) &&
          ((_second > (_array.length * 0.8)) || (_second < (_array.length * 0.2)))){
            _note = -1;
          }
          if (_first >= (_array.length - 2)){
            _first_el =  (_array.length * 2) - _first - 3;
          }
          else {
            _first_el = _array.length - 1 - _first - 2;
          }
          if (_second >= (_array.length - 2)){
            _second_el = (_array.length * 2) - _second - 3;
          }
          else {
            _second_el = _array.length - 1 - _second - 2;
          }
          Connect(_first_el, _second_el, _note);
        }

      }
    }
  }
