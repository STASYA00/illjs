// Pie Diagram in Adobe Illustrator

#include "interface.js";
#include "mode.js";
#include "utils.js";

// TODO: scale a part of one axis if too far from zero -> start the axis not from 0
function scatterMain(config, csvFile){

  if (csvFile != null){
      fileArray = readInCSV(csvFile);
      Columns = fileArray[0];
      var feature = scatterInterface(Columns);
      if (typeof feature == "object"){
        var X = new Array();
        var Y = new Array();
        var Texts = new Array();
        var Color = new Array();

        for (i=1; i<fileArray.length; i++){
          X.push(fileArray[i][getIndex(Columns, feature[0])]);
          Y.push(fileArray[i][getIndex(Columns, feature[1])]);
          Color.push(fileArray[i][getIndex(Columns, feature[2])]);
          // Texts.push(fileArray[i][getIndex(Columns, feature[0])]);
        }

        NewLayer('Diagram');
        NewLayer('Points');
        diagram_color = setMode(feature[3]);
        setBgr(diagram_color[0], config);
        colors = getUnique(Color);  // TODO:  Transform into color arrays
        scaled_values_x = scaleValues(X, config.image_size - (4 * config.margin));
        scaled_values_y = scaleValues(Y, config.image_size - (4 * config.margin));
        color_categories = getCategoriesVector(Color);

        for (_point=0; _point < X.length; _point++){
          var small_circle = config.doc.layers.getByName('Points').pathItems.ellipse((
            Math.round(2*config.margin + scaled_values_y[_point]) + config.small_radius),
            2*config.margin + Math.round(scaled_values_x[_point]) - config.small_radius,
            2*config.small_radius, 2*config.small_radius, false);
          small_circle.filled = true;
          _c = 255 * color_categories[_point] / (colors.length + 1);
          small_circle.fillColor = makeColor([_c, _c, _c]);
          small_circle.stroked = false;
        }
        placeAxis('Diagram', [Math.round(1.5*config.margin), Math.round(2*config.margin)],
                             [Math.round(2*config.margin), Math.round(1.5*config.margin)],
                             config, diagram_color[1]);
        a_x = findGrid(getMaxOfArray(scaled_values_x), getMaxOfArray(X), getMinOfArray(X));
        a_y = findGrid(getMaxOfArray(scaled_values_y), getMaxOfArray(Y), getMinOfArray(Y));
        gridNumbers(a_x[0], a_x[1], [[2 * config.margin, 2 * config.margin],
                    [config.image_size - config.margin, 2 * config.margin]],
                    'Diagram', diagram_color[1], 1, feature[4]);
        gridNumbers(a_y[0], a_y[1], [[2 * config.margin, 2 * config.margin],
                    [2 * config.margin, config.image_size - (0.5 * config.margin)]],
                    'Diagram', diagram_color[1], 0, feature[4]);
        }
        else {
          call_diagram(feature, config, csvFile);
        }
      }
}
