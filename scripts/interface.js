
function pieInterface(_array){
  /*
   * Activates the pop up window where the features are chosen.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */
  var icons_a = File("D:/Google Drive/Portfolio/references_for_portfolio/WORK/##/illjs/assets/icons/circle.png");
  var icons_b = File("D:/Google Drive/Portfolio/references_for_portfolio/WORK/##/illjs/assets/icons/donut.png");
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:false});
  // Adds a dropdown list to define the names of the items
  _win.add('statictext', undefined, 'Categories');
  var _categories = _win.add('dropdownlist', undefined, _array);
  _categories.selection = 0;
  // Adds a dropdown list to define the column to count the percentage of
  _win.add('statictext', undefined, 'Value');
  var _values = _win.add('dropdownlist', undefined, _array);
  _values.selection = 1;

  _win.add('statictext', undefined, 'Choose the diagram type:');
  var _circle_diagram = _win.add('iconbutton', undefined, icons_a, {style:"toolbutton", toggle:true});
  var _donut_diagram = _win.add('iconbutton', undefined, icons_b, {style:"toolbutton", toggle:true});

  _win.add('statictext', undefined, 'Initial Angle');
  var _initial_angle = _win.add('edittext', undefined, 60);
  var _close = _win.add('button', undefined, 'OK');
  _win.show();
  _initial_angle = Number(_initial_angle.text);
  return [_categories.selection.text, _values.selection.text,
          _circle_diagram.value, _initial_angle]
  _win.close();
}

function barInterface(_array){
  /*
   * Activates the pop up window where the features are chosen.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */
  var icons_a = File("D:/Google Drive/Portfolio/references_for_portfolio/WORK/##/illjs/assets/icons/circle.png");
  var icons_b = File("D:/Google Drive/Portfolio/references_for_portfolio/WORK/##/illjs/assets/icons/donut.png");
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:false});
  // Adds a dropdown list to define the names of the items
  _win.add('statictext', undefined, 'Categories');
  var _categories = _win.add('dropdownlist', undefined, _array);
  _categories.selection = 0;
  // Adds a dropdown list to define the column to count the percentage of
  _win.add('statictext', undefined, 'Value');
  var _values = _win.add('dropdownlist', undefined, _array);
  _values.selection = 1;

  _win.add('statictext', undefined, 'Choose the diagram type:');

  _win.add('statictext', undefined, 'Choose the background color:');
  var _bgr = _win.add('dropdownlist', undefined, ['transparent', 'white', 'gray', 'black']);
  _bgr.selection = 1;

  var size_check = _win.add ("checkbox", undefined,
                       "Display grid on the diagram");
  size_check.value=false;

  var _close = _win.add('button', undefined, 'OK');
  _win.show();
  return [_categories.selection.text, _values.selection.text,
          _bgr.selection.text, size_check.value]
  _win.close();
}

function circularRelationshipInterface(_array){
  /*
   * Activates the pop up window where the features are chosen.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:false});
  // Adds a dropdown list to define the outer circle column (Cateogry)
  _win.add('statictext', undefined, 'Outer Circle');
  var _list_outer = _win.add('dropdownlist', undefined, _array);
  // Adds a dropdown list to define the inner circle column (Subcategory)
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

function areaInterface(_array){
  /*
   * Activates a pop up window where the features are chosen.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:false});
  // Adds a dropdown list to define the outer circle column (Cateogry)
  _win.add('statictext', undefined, 'Total Area');
  var _list_outer = _win.add('dropdownlist', undefined, _array);
  // Adds a dropdown list to define the inner circle column (Subcategory)
  _win.add('statictext', undefined, 'Partial Area');
  var _list_inner = _win.add('dropdownlist', undefined, _array);

  var _close = _win.add('button', undefined, 'OK');
  //alert(_list.selection.constructor.name, 0);
  _win.show();
  return [_list_outer.selection.text, _list_inner.selection.text]
  _win.close();
}

function scatterInterface(_array){
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:false});
  _win.add('statictext', undefined, 'Feature along X axis');
  var _x = _win.add('dropdownlist', undefined, _array);
  _x.selection = 4;
  _win.add('statictext', undefined, 'Feature along Y axis');
  var _y = _win.add('dropdownlist', undefined, _array);
  _y.selection = 5;
  _win.add('statictext', undefined, 'Color Feature (Categorical)');
  var _colors = _win.add('dropdownlist', undefined, _array);
  _colors.selection = 2;
   _win.add('statictext', undefined, 'Choose the background color:');
  var _bgr = _win.add('dropdownlist', undefined, ['transparent', 'white',
    'gray', 'black']);
  _categories.selection = 0;
  var _close = _win.add('button', undefined, 'OK');
  _win.show();
  return [_x.selection.text, _y.selection.text, _colors.selection.text,
    _bgr.selection.text]
  _win.close();
}
