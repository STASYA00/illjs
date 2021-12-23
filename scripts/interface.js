function button_pressed(e){
  if (e.target.type == 'iconbutton'){
    diagram_to_make = e.target.icon.name.slice(0, -4);
  }
  return diagram_to_make
}

function call_diagram(name, config, csvFile){
  var dict = {'bar':barMain, 'pie':pieMain, 'scatter':scatterMain,
              'circular_relationships':cRMain};
  dict[name](config, csvFile);
}

function diagramInterface(){
  /*
   * Activates the pop up window with all the diagram types available.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */

  dir = $.fileName.slice(0, -20) + "assets/icons/";
  var _win = new Window("dialog", 'Choose diagram.', undefined,// [300,100,800,600],
                        {closeButton:true, borderless:false});
  _win.margins = [7, 7, 7, 10];
  // 500x500
  // Adds a dropdown list to define the names of the items
  // panel = _win.add('panel', [20,10,520,480], 'Diagrams'.toUpperCase());

  // panel.add('statictext', [220,10,320,30], 'Diagrams');  // [left,top,right,bottom]

  // _win.add('statictext', [250,20,400,40], 'Choose Diagram Type:');
  icon_size = 100;
  icon_gap = 20;
  icon_margin = 40;
  _diagram_group = _win.add('group');
  diagrams = ['pie', 'bar', 'circular_relationships', 'scatter'];

  // [(icon_gap * (i+1)) + (icon_size * i), icon_margin,
   // (icon_size+icon_gap) * i, (icon_margin + icon_size)]
  for (i=0; i<diagrams.length; i++){
    _a = _diagram_group.add('iconbutton',  undefined,
                       File(dir + diagrams[i] + '.png'),
                       {style:"toolbutton", toggle:false, name:diagrams[i]});
    _a.name = diagrams[i];
  }
  _diagram_group.addEventListener('click', button_pressed);
  var buttonGroup = _win.add('group');
  var _close = buttonGroup.add('button', [170, 450, 330, 480], 'OK', {name:"ok"});
  // _win.show();
  if (_win.show() == 1){
    return diagram_to_make
  }
  else {
    return 0
  }
  _win.close();
}

function pieInterface(_array){
  /*
   * Activates the pop up window where the features are chosen.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */
  dir = $.fileName.slice(0, -20) + "assets/icons/";
  var icons_a = File(dir + "circle.png");
  var icons_b = File(dir + "donut.png");
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:true, borderless:false});
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

  _win.add('statictext', undefined, 'Choose the background color:');
 var _bgr = _win.add('dropdownlist', undefined, ['transparent', 'white',
   'gray', 'black']);
 _bgr.selection = 0;

  _win.add('statictext', undefined, 'Initial Angle, optional');
  var _initial_angle = _win.add('edittext', undefined, 60);
  var _close = _win.add('button', undefined, 'OK', {name:"ok"});
  // _win.show();

  if (_win.show() == 1){
    _initial_angle = Number(_initial_angle.text);
    return [_categories.selection.text, _values.selection.text,
            _circle_diagram.value, _bgr.selection.text, _initial_angle]
  }
  else {
    return diagramInterface()
  }
  _win.close();
}

function barInterface(_array){
  /*
   * Activates the pop up window where the features are chosen.
   * Output: list [Category Column, Subcategory Column, Connection Column,
   *               Connection threshold [, size column]]
   */
  dir = $.fileName.slice(0, -20) + "assets/icons/";
  var icons_a = File(dir + "circle.png");
  var icons_b = File(dir + "donut.png");
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

  _win.add('statictext', undefined, 'Choose the background color:');
  var _bgr = _win.add('dropdownlist', undefined, ['transparent', 'white', 'gray', 'black']);
  _bgr.selection = 1;

  var size_check = _win.add ("checkbox", undefined,
                       "Display grid on the diagram");
  size_check.value = false;

  var _close = _win.add('button', undefined, 'OK', {name:"ok"});
  // _win.show();
  if (_win.show() == 1){
    return [_categories.selection.text, _values.selection.text,
            _bgr.selection.text, size_check.value]
  }
  else {
    return diagramInterface()
  }
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

  _win.add('statictext', undefined, 'Choose the background color:');
  var _bgr = _win.add('dropdownlist', undefined, ['transparent', 'white', 'gray', 'black']);
  _bgr.selection = 0;

  var _close = _win.add('button', undefined, 'OK', {name:"ok"});
  //alert(_list.selection.constructor.name, 0);
  // _win.show();
  if (_win.show() == 1){
    if (size_check.value == true){
      return [_list_outer.selection.text, _list_inner.selection.text,
              _list_connect.selection.text, _slider.value,
              _list_inner_size.selection.text, _bgr.selection.text]
    }
    else {
      return [_list_outer.selection.text, _list_inner.selection.text,
              _list_connect.selection.text, _slider.value, _bgr.selection.text]
    }
  }
  else {
    return diagramInterface()
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

  var _close = _win.add('button', undefined, 'OK', {name:"ok"});
  //alert(_list.selection.constructor.name, 0);
  // _win.show();
  if (_win.show() == 1){
    return [_list_outer.selection.text, _list_inner.selection.text]
  }
  else {
    return []
  }

  _win.close();
}

function scatterInterface(_array){
  var _win = new Window("dialog", 'Choose the columns.', undefined,
                        {closeButton:false});
  _win.add('statictext', undefined, 'Feature along X axis');
  var _x = _win.add('dropdownlist', undefined, _array);
  _x.selection = 0;
  _win.add('statictext', undefined, 'Feature along Y axis');
  var _y = _win.add('dropdownlist', undefined, _array);
  _y.selection = 1;
  _win.add('statictext', undefined, 'Color Feature (Categorical)');
  var _colors = _win.add('dropdownlist', undefined, _array);
  _colors.selection = 2;
   _win.add('statictext', undefined, 'Choose the background color:');
  var _bgr = _win.add('dropdownlist', undefined, ['transparent', 'white',
    'gray', 'black']);
  _bgr.selection = 0;
  var size_check = _win.add ("checkbox", undefined,
                       "Display grid on the diagram");
  size_check.value=false;
  // _categories.selection = 0;
  var _close = _win.add('button', undefined, 'OK', {name:"ok"});

  if (_win.show() == 1){
    return [_x.selection.text, _y.selection.text, _colors.selection.text,
      _bgr.selection.text, size_check.value]
  }
  else {
    return diagramInterface()
  }
  _win.close();
}
