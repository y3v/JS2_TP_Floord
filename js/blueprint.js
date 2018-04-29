'use strict';
const BLUEPRINT_BGD = '#363ba0'

let s = Snap('#svg0');
let sur = $('#svg0')
let drb = $('#drawboard')
let shapes = []
let items = ['wall', 'door', 'restroom', 'kitchen', 'table', 'bar']
let colored = false;
let MXY = {}
let drawboard_coords = {}
let draggedObj = {}

document.addEventListener('DOMContentLoaded', function(){
  let menu = s.rect(0, (sur.outerHeight() - 150), sur.outerWidth(), 150)
  menu.attr({
    fill: BLUEPRINT_BGD,
    stroke: 'lightgrey',
    strokeWidth: 4
  })
  MXY = menu.getBBox();
  console.log(MXY);
  let itemW = (MXY.w / items.length) - 10
  let itemH = MXY.h - 20

  // add all the elements to the menu
  for (var i = 0; i < items.length; i++) {
    let g = s.group();
    let ix = i === 0 ? 5 :(i * (itemW + 10)) + 5
    let icon = g.image(`../images/${items[i]}.png`, ix, MXY.y + 10, itemH, itemH)

    // Add drag(dragMove, dragStart, dragEnd) event
    icon.drag(dragMove, dragStart, dragEnd)
    icon.desc = items[i];
    icon.clonable = true;
  }
});

function dragStart(x, y, ev) {
  // duplicates the icon
  if (this.clonable){
    draggedObj = this.clone();
    draggedObj.desc = this.desc;
    draggedObj.drag(dragMove, dragStart, dragEnd)
    draggedObj.clonable = false;
  }
  else{
    console.log("NOT CLONED")
    this.lastX = this.attr().x;
    this.lastY = this.attr().y;
  }
}

function dragMove(dx, dy, x, y, ev) {
  // just so the mouse ptr is in the middle of the icon
  if (this.clonable){
    console.log("MOVING AFTER CLONING")
    draggedObj.attr({
      x: x - (5 + this.attr().width/2), // where 5 is the body margin
      y: y - (200 + this.attr().height/2) // where 200 is header height (rethink)
    });
  }
  else{
    console.log("JUST MOVING")
    this.attr({
      x: x - (5 + this.attr().width/2), // where 5 is the body margin
      y: y - (200 + this.attr().height/2) // where 200 is header height (rethink)
    });
    console.log(`X: ${this.attr().x} and y: ${this.attr().y}`)
  }
}
function dragEnd(ev) {
  // removes the icon from the screen
  //draggedObj.remove();

  // if the mouse ptr is in the drawboard region on release, add an item
  if (ev.clientX > 0 && ev.clientX < sur.outerWidth() && ev.clientY < (sur.outerHeight() - 280)){
    console.log(this.desc);
  }
  else{
    console.log("REMOVING")

    //if you move an existing object out of bound, bring back to last recorded coordinates
    if (!this.clonable){
      this.attr({
        x: this.lastX,
        y: this.lastY
      });
    }
    else{
      draggedObj.remove();
    }
  }


}



function getBBox() {
  console.log(s);
}

function collapseRight(ev) {
  let img = $('#collexpand')

  // IF EXPANDED
  if (img.attr('src').includes('collapse')){
    img.attr('src', './images/hamburger.png');
    $('#lib-container').css('width', '45px');
    $('#svg0').attr('width', 'calc(100% - 50px)');
  }

  // IF COLLAPSED
  else {
    img.attr('src', './images/collapse.png');
    $('#lib-container').css('width', '19%');
    $('#svg0').attr('width', '80%');
  }
}

function configModal(item){


}
