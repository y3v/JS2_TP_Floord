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

  let bbox = s.getBBox();
  console.log(bbox);
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

  // creates new icon / element
  if (this.clonable){

    switch (this.desc) {
      case 'wall':
      case 'linewall':
        draggedObj = s.line(x -50 , y, x + 50, y);
        draggedObj.attr({
          x1: x -50,
          y1: y,
          x2: x + 50,
          y2: y,
          stroke: 'white',
          strokeWidth: 5
        })
        draggedObj.desc = 'linewall';
        break;

      default:
        draggedObj = this.clone();
        draggedObj.desc = this.desc;
        break;
    }

    draggedObj.drag(dragMove, dragStart, dragEnd)
    draggedObj.clonable = false;
  }

  else {
    console.log("NOT CLONED")

    switch (this.desc) {
      case 'wall':
      case 'linewall':
        this.lastX1 = this.attr().x1;
        this.lastX2 = this.attr().x2;
        this.lastY1 = this.attr().y1;
        this.lastY2 = this.attr().y2;
        break;

      default:
        this.lastX = this.attr().x;
        this.lastY = this.attr().y;
        break;
    }
  }
}

function dragMove(dx, dy, x, y, ev) {
  // just so the mouse ptr is in the middle of the icon
  if (this.clonable){

    switch (this.desc) {
      case 'wall':
      case 'linewall':
        draggedObj.attr({
          x1: x -50,
          y1: y - 280,
          x2: x + 50,
          y2: y -280 // where 200 is header height (rethink)
        });
        break;

      default:
        console.log("MOVING AFTER CLONING")
        draggedObj.attr({
          x: x - (5 + this.attr().width/2), // where 5 is the body margin
          y: y - (200 + this.attr().height/2) // where 200 is header height (rethink)
        });
        break;
    }
  }
  else{
    console.log("JUST MOVING")

    switch (this.desc) {
      case 'wall':
      case 'linewall':
        this.attr({
          x1: x -50,
          y1: y - 280,
          x2: x + 50,
          y2: y -280 // where 200 is header height (rethink)
        });
        break;

      default:
        this.attr({
          x: x - (5 + this.attr().width/2), // where 5 is the body margin
          y: y - (200 + this.attr().height/2) // where 200 is header height (rethink)
        });
        break;
    }
  }
}

function dragEnd(ev) {
  // removes the icon from the screen
  //draggedObj.remove();

  // if the mouse ptr is in the drawboard region on release, add an item
  if (ev.clientX > 50 && ev.clientX < sur.outerWidth() && ev.clientY < (sur.outerHeight() - 280) && ev.clientY > 258){

    switch (this.desc) {

      case 'wall':
      case 'linewall':
        if (!this.dblclickSet)
          this.dblclick(configModal);
        this.dblclickSet = true;
        break;

      case 'table':
        if (!this.dblclickSet){
          this.dblclick(a=>configTable(this))
        }
        this.dblclickSet = true;
        break;
    }
  }
  else{
    console.log("REMOVING")

    //if you move an existing object out of bound, bring back to last recorded coordinates
    if (!this.clonable){

      switch (this.desc) {

        case 'wall':
        case 'linewall':
          this.attr({
            x1: this.lastX1,
            x2: this.lastX2,
            y1: this.lastY1,
            y2: this.lastY2
          });
          break;

        default:
          this.attr({
            x: this.lastX,
            y: this.lastY
          });
          break;
      }
    }
    else{
      draggedObj.remove();
    }
  }
}


function configModal(item){
  let modal = $('<div>').addClass('modal');
  let content = $('<div>').addClass('modal-content');

  content.append(configItem('width', 'number'));
  content.append(configItem('height', 'number'));
  content.append(configItem('position', 'radio'));
  content.append(configItem('x', 'number'));
  content.append(configItem('y', 'number'));
  content.append(configButton(modal, "save"))
  content.append(configButton(modal, "close"))

  modal.append(content);
  $('body').append(modal);

  removeIfClickedOutside(modal)

}

function configItem(label, type) {
  let uLabel = capitalize(label);
  let option = $('<div>').attr('id', label);

  if (type !== 'radio'){
    option.append($('<input>').attr('type', type).attr('id', `item${uLabel}`))
    .prepend($('<label>').attr('for', `item${uLabel}`).text(uLabel))
    .addClass('itemConfig');
  }
  else{
    option.append($('<label>').text('Alignment')).addClass('itemConfig')
          .append($('<label>').attr('for', `hAlign`).text('Horizontal').addClass('alignLabel'))
          .append($('<input>').attr('type', 'radio')
                              .attr('id', `hAlign`)
                              .attr('name', 'alignment')
                              .attr('value', 'horizontal')
                              .addClass('modalRadio'))
          .append($('<label>').attr('for', `vAlign`).text('Vertical').addClass('alignLabel'))
          .append($('<input>').attr('type', 'radio')
                              .attr('id', `vAlign`)
                              .attr('name', 'alignment')
                              .attr('value', 'vertical')
                              .addClass('modalRadio'))
  }

  return option;
}

function configTable(item, item2){

  console.log(item)
  let modal = $('<div>').addClass('modal');
  let content = $('<div>').addClass('modal-content');

  content.append(configItem('seats', 'number'));
  content.append(configButton(modal, "save", item))
  content.append(configButton(modal, "close", null))

  modal.append(content);
  $('body').append(modal);

  removeIfClickedOutside(modal)
}

function configButton(modal, type, data) {
  let button;
  if (type=="close"){
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.on("click", e=> modal.remove())
  }

  if (type == "save"){
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.on("click", e=>{
      data.seats = $('#itemSeats').val()
      let table = createTableGraphic(data)
    })
  }

  return button;
}

function createTableGraphic(table){
  console.log(table.node.parentElement)
  //table.node.parentElement.rect((table.attr().x), table.attr().y, 50, 50)
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

function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function removeIfClickedOutside(modal){
  //if you click anywhere outside of the dialog box (modal), it will close
  window.onclick = function(event) {
    // Note: modal is a Jquery object, to compare you must take the JS object using get(0)
    if (event.target == modal.get(0)) {
        modal.remove();
    }
  }
}
