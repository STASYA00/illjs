// Pie Diagram in Adobe Illustrator

#include "interface.js";
#include "utils.js";
#include "pie_functions.js";



function pieMain(config, csvFile){

  if (csvFile != null){
      fileArray = readInCSV(csvFile);
      var Columns = new Array();
      Columns = fileArray[0];
      var feature = pieInterface(Columns);
      if (typeof feature == "object"){
        var Texts = new Array();
        var Percentage = new Array();
        var initial_angle = feature[4];
        for (i=1; i<fileArray.length; i++){
          Percentage.push(fileArray[i][getIndex(Columns, feature[1])]);
          Texts.push(fileArray[i][getIndex(Columns, feature[0])]);
        }

        NewLayer('Diagram');
        NewLayer('Parts');
        NewLayer('Texts');
        diagram_color = setMode(feature[3]);
        setBgr(diagram_color[0], config);

        dict = SumUnique(Texts, Percentage);
        texts = getUnique(Texts);
        values = new Array();
        for (var _text in texts){
          values.push(dict[texts[_text]])
        }
        sections = ScaleArray(values, 360);
        fineness = 45;


        for (_section=0; _section < sections.length; _section++){
          makeSector(initial_angle, sections[_section], _section, 'Parts', config, diagram_color);
          initial_angle = initial_angle + sections[_section];
          var Text = config.doc.layers.getByName('Texts').textFrames.add();
          Text.contents = texts[_section].toUpperCase() + '\n' + Math.round(sections[_section] / 3.6).toString() + '%';
          textApp(Text, 30, getArrayFromColor(diagram_color[1]));
          distribute(Text, initial_angle - (.5 * sections[_section]), .87 * config.radius, Text.width, config.center);

        }
        if (feature[2] == false){
          makeDonut('Parts', config.center, diagram_color);
        }
      }
      else {
        call_diagram(feature, config, csvFile);
      }
  }

}
