#include "utils.js"

function setMode(color){
  /* Function that makes background color and line color based on the mode.
   * Input   color          name of the mode, str, one of: gray, black, white, transparent
   * Output  bgr, line      two colors, Color class
   */
  if (color == 'white'){
    return [makeColor([255, 255, 255]), makeColor([0, 0, 0])]
  }
  else if (color == 'gray') {
    return [makeColor([200, 200, 200]), makeColor([0, 0, 0])]
  }
  else if (color == 'black'){
    return [makeColor([0, 0, 0]), makeColor([255, 255, 255])]
  }
  else {
    return [0, makeColor([0, 0, 0])]
  }
}

function setBgr(bgr_color, config){
  /* Function that sets background.
   * Input bgr_color          color of background, Color
   *       config             configuration of the diagram, dict
   */

   if ((bgr_color != 'transparent') && (bgr_color != 0)){
     var bgr = config.doc.layers.getByName('Diagram').pathItems.rectangle(0, 0, config.image_size,
                                                                   -config.image_size);
     bgr.stroked = false;
     bgr.filled = true;
     bgr.fillColor = bgr_color;
     bgr.zOrder(ZOrderMethod.SENDTOBACK);
   }
}
