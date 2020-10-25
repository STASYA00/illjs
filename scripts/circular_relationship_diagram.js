#include "utils.js";
#include "interface.js";
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
    var feature = circularRelationshipInterface(Columns);
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
      textApp(Text, 14, [51, 43, 43, 7]);
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
        textApp(Text, 14, [68, 61, 60, 49]);
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

function textRotate(_obj, _t, _array_length){
  /* Rotates an object to a given portion of a circle.
   * Input: _obj           object to rotate (usually text)
   *        _t             number of a part/iteration, int
   *        _array_length  total fractions of a circle, int
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
   * Input: _obj           object to rotate (usually text)
   *        _i             number of a part/iteration, int
   *        _length        total fractions of a circle, int
   *        _own_radius    radius of the object to be assigned and used in the
   *                       correction; pass 0 if not applicable, int
   * Output: _x             horizontal coordinate to place the object, int (pix)
   *         _y             vertical coordinate to place the object, int (pix)
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
   * Input: _obj           object to rotate (usually text)
   *        _i             number of a part/iteration, int
   *        _length        total fractions of a circle, int
   *        _radius        radius of a circle to distribute the objs around, int
   *        _own_radius    own radius of an object (0 if Text), int
   */
  _x = Math.round(center[1] +
                  (_radius * Math.sin(_i * (360/_length) * Math.PI / 180)));
  _y =  Math.round(center[0] +
                   (_radius * Math.cos(_i * (360/_length) * Math.PI / 180)));
  _x, _y = CorrectPosition(_obj, _i, _length, _own_radius);
  _obj.left = _x; // assigns the object's left offset in pixels
  _obj.top = _y; // assigns the object's top offset in pixels
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
