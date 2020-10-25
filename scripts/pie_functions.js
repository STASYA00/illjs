#include "utils.js";
//
//
// radius = Math.min(getDocSize()[0], getDocSize()[1]) * 0.4;
// center = [getDocCenter()[0], getDocCenter()[1]];

function distribute(_obj, _angle, _radius, _own_length){
  /* Gets object's coordinates on a circle of a given radius.
   * Input: _obj           object to rotate (usually text)
   *        _i             number of a part/iteration, int
   *        _length        total fractions of a circle, int
   *        _radius        radius of a circle to distribute the objs around, int
   *        _own_length    own radius of an object (0 if Text), int
   */
  _x = Math.round(center[0] +
                  (_radius * Math.sin(_angle * Math.PI / 180)) -
                  (.5*_own_length));
  _y =  Math.round(center[1] +
                   (_radius * Math.cos(_angle * Math.PI / 180)));
  // _x, _y = CorrectPosition(_obj, _i, _length, _own_radius);
  _obj.left = _x; // assigns the object's left offset in pixels
  _obj.top = _y; // assigns the object's top offset in pixels
}

function makeDonut(_layer, center){
  /* A function that iterates over the elements of the pie diagram and cuts
   * the central piece from them (so the diagram from pie becomes a donut).
   * Input:     _layer          layer that the pie diagram elements belong to
   * Output:    None
   */
  for (_item=0; _item<doc.layers.getByName(_layer).pathItems.length;_item++){
    var small_circle = doc.layers.getByName(_layer).pathItems.ellipse(((center[1])+(0.4*radius)),
      ((center[0]) - (0.4*radius)), .8*radius, .8*radius, false);
    small_circle.filled = true;
    small_circle.fillColor = makeColor([255, 255, 255]);
    small_circle.stroked = true;
    small_circle.strokeColor = makeColor([100, 100, 100]);
    minusFront(doc.layers.getByName(_layer).pathItems[_item+1], small_circle);
  }
}

function makeSector(_init_angle, _angle, _section, _layer){
  /* Makes a sector with a vertical start
   * Input: _init_angle    angle from which the diagram building starts
   *        _angle         angle of the sector, float
   *        _section       size of the section, percentage, float
   *        _layer         name of the diagram layer, str
   */
   var _line = doc.layers.getByName(_layer).pathItems.add();
   _coords = Array(center, findCircPoint(_init_angle),
                   findCircPoint(_init_angle + (_angle/2)),
                   findCircPoint(_init_angle + _angle));
   var inside_angles = new Array();
   inside_angles.push(_angle/2);
   if (_angle < 90){
     if (_angle >= (fineness * 1.5)){
       _a = Math.round(_angle / fineness);
       _coords.splice(2, 1);
       inside_angles.splice(0, 1, _angle - Math.round(_angle/_a));
       for (i=0; i<(_a-1); i++){
         _coords.splice(2 + i, 0,
                        findCircPoint(Math.round(_init_angle + ((i + 1) *
                                                                 _angle/_a))));
         inside_angles.splice(0, 0, Math.round(_angle/_a));
        }
     }
   }
   else {
     _coords.splice(2, 1);
     set90Points(_coords, _init_angle, _angle);
   }

   _line.setEntirePath(_coords); // draws a line using given coordinates.

   if (_angle < 90) {
     for (_p=2; _p < (_line.pathPoints.length - 1); _p++){
       var _point = _line.pathPoints[_p];
       _point.pointType = PointType.SMOOTH;
       setAnchorPoint(_point, _init_angle, inside_angles[(_p-2)]);
       _init_angle = _init_angle + inside_angles[(_p-2)]
     }
   }
   else {
     rem = (_angle % 90) / 2
     // sets the first curve point
     set90Anchors(_line.pathPoints[2], 1, rem, _init_angle + rem);
     // sets the last curve point
     set90Anchors(_line.pathPoints[(_line.pathPoints.length - 2)], 2,
                  rem, _init_angle + _angle - rem);
    for (_p=3; _p<(_line.pathPoints.length - 2); _p++){
      // sets the middle curve points
      set90Anchors(_line.pathPoints[_p], 0,
                   rem, _init_angle + rem + (90*(_p-2)));
    }
   }
   _line.filled = true;
   _line.fillColor = makeColor([255, 255, 255]);
   _line.stroked = true;
   _line.strokeColor = makeColor([100, 100, 100]);
   _line.closed = true;
}

function getChord(_angle){
  /* Gets the length of the chord
   *
   */
   return 2 * radius * Math.sin(_angle * 0.5 * Math.PI / 180)
}

function findCircPoint(_angle){
  /* Finds a point on the circumference, measuring the given angle from the
   * vertical axis.
   * Input: _angle         angle of the sector, float
   */
  _x = Math.round(center[0] + (radius * Math.sin(_angle * Math.PI / 180)));
  _y = Math.round(center[1] + (radius * Math.cos(_angle * Math.PI / 180)));
  _array = Array(_x, _y);
  return _array
}

function setAnchorPoint(_point, _init_angle, _angle){
  /* Finds a point on the circumference, measuring the given angle from the
   * vertical axis.
   * Input: _point         point to which the handles belong, PathPoint
   *        _angle         angle of the sector, float)
   */
   // TODO: check the handles' directions and 90 angle
   // TODO: change the handle length to 1/4 of hord length
  _p_coords = _point.anchor;
  _point.leftDirection = [_point.anchor[0] + ((getChord(_angle*2)*0.28) *
                                               Math.sin((-(_init_angle + _angle) - 90) *
                                               Math.PI / 180)),
                          _point.anchor[1] - ((getChord(_angle*2)*0.28) *
                                               Math.cos((-(_init_angle + _angle) - 90) *
                                               Math.PI / 180))];
  _point.rightDirection = [_point.anchor[0] - ((getChord(_angle*2)*0.28) *
                                                Math.sin((-(_init_angle + _angle) - 90) *
                                                Math.PI / 180)),
                           _point.anchor[1] + ((getChord(_angle*2)*0.28) *
                                                Math.cos((-(_init_angle + _angle) - 90) *
                                                Math.PI / 180))];
}

function set90Anchors(_point, anchortype, _rem, _angle){
  /* A function that sets curved handles in a sector that is larger than 90 deg.
   * _point         Point, a point to apply the handles to
   * anchortype     anchortype, point's position on the curve to understand how
   *                to set the handles: 0 - middle point, 90 to any other point
   *                                    1 - first point, short left handle
   *                                    2 - last point, short right handle
   * _rem           for anchortypes 1, 2: the short angle to set the handle
   * _angle         angle from the center of the circle, counting clockwise from
   *                the top of the circle, degrees.
   */
  _p_coords = _point.anchor;
  _point.leftDirection = [_point.anchor[0] + ((radius*0.56) *
                                               Math.sin((-(_angle) - 90) *
                                               Math.PI / 180)),
                          _point.anchor[1] - ((radius*0.56) *
                                               Math.cos((-(_angle) - 90) *
                                               Math.PI / 180))];
  _point.rightDirection = [_point.anchor[0] - ((radius*0.56) *
                                                Math.sin((-(_angle) - 90) *
                                                Math.PI / 180)),
                           _point.anchor[1] + ((radius*0.56) *
                                                Math.cos((-(_angle) - 90) *
                                                Math.PI / 180))];
  if (anchortype==1) {
    _point.leftDirection = [_point.anchor[0] + ((getChord(_rem*2)/4) *
                                                 Math.sin((-(_angle) - 90) *
                                                 Math.PI / 180)),
                            _point.anchor[1] - ((getChord(_rem*2)/4) *
                                                 Math.cos((-(_angle) - 90) *
                                                 Math.PI / 180))];
  }
  if (anchortype==2) {
    _point.rightDirection = [_point.anchor[0] - ((getChord(_rem*2)/4) *
                                                 Math.sin((-(_angle) - 90) *
                                                 Math.PI / 180)),
                            _point.anchor[1] + ((getChord(_rem*2)/4) *
                                                 Math.cos((-(_angle) - 90) *
                                                 Math.PI / 180))];
  }
}
function set90Points(_coords, _init_angle, _angle){
  rem = (_angle % 90) / 2;
  if (rem != 0){
    _coords.splice(2, 0, findCircPoint(_init_angle + rem))
    for (_a=0; _a<Math.floor(_angle/90); _a++){
      _coords.splice(3+_a, 0, findCircPoint(_init_angle + rem + 90 * (_a+1)))
    }
  }
}


////////////////////////////////////////////////////////////////////////////////
// Technical functions
