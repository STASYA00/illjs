// Barplot Diagram in Adobe Illustrator

// TODO: styles for diagrams
// TODO: marks 50 100 etc
// TODO: catplot and violinplot

#include "interface.js";
#include "utils.js";


function barMain(config, csvFile){
  // TODO: negative values handling

  if (csvFile != null){
      fileArray = readInCSV(csvFile);
      var Columns = new Array();
      Columns = fileArray[0];
      var feature = barInterface(Columns);
      if (typeof feature == "object"){
        var Texts = new Array();
        var Percentage = new Array();
        for (i=1; i<fileArray.length; i++){
          Percentage.push(fileArray[i][getIndex(Columns, feature[1])]);
          Texts.push(fileArray[i][getIndex(Columns, feature[0])]);
        }
        NewLayer('Diagram');
        NewLayer('Parts');
        NewLayer('Texts');
        text_size = 30;
        dict = SumUnique(Texts, Percentage);
        texts = getUnique(Texts);
        values = new Array();
        // background
        diagram_color = setMode(feature[2]);
        setBgr(diagram_color[0], config);
        // Diagram
        for (var _text in texts){
          values.push(parseInt(dict[texts[_text]]))
        }
        scaled_values = scaleValues(values, config.image_size - (4 * config.margin));
        bar_width = (config.image_size - (3 * config.margin)) / scaled_values.length;

        for (_value=0; _value < scaled_values.length; _value++){
          var bar = config.doc.layers.getByName('Parts').pathItems.rectangle(
            Math.round(3*config.margin + (scaled_values[_value])),
            Math.round((2*config.margin) + (bar_width * _value)),
            Math.round((config.image_size - (3*config.margin)) / scaled_values.length),
            Math.round(scaled_values[_value]));
          bar.fillColor = diagram_color[0];
          bar.strokeColor = diagram_color[1];
          var text = config.doc.layers.getByName('Texts').textFrames.add();
          text.contents = texts[_value].toUpperCase();
          textApp(text, text_size, [100, 100, 100]);
          if (_value == 0) {
            while (text.height > bar_width) {
              text_size -= 1;
              textApp(text, text_size, [100, 100, 100]);
            }
          }

          text.rotate(90);
          text.left = Math.round((2*config.margin) + (bar_width * (_value + 0.5)) - (text.width * 0.5));
          text.top = Math.round(2 * config.margin);
        }
        placeAxis('Diagram', [0.5 * config.margin, 3 * config.margin],
                  [config.margin, 2.5 * config.margin], config, diagram_color[1]);

        // grid
        a = findGrid(getMaxOfArray(scaled_values), getMaxOfArray(values));
        start_coords = new Array([config.margin, 3 * config.margin],
                                 [Math.round(config.image_size - (0.5 * config.margin)),
                                  3 * config.margin]);
        gridNumbers(a[0], a[1], start_coords, 'Diagram', diagram_color[1], 1, feature[3]);
      }
      else {
        call_diagram(feature, config, csvFile);
      }
  }

}
