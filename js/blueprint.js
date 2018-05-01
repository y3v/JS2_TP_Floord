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
let dragGroup = {}
const TABLE_STYLE = "fill:white; stroke:#232670; stroke-width:5;"
const KITCHEN_STYLE = "fill:#cec3db; stroke:#232670; stroke-width:5;"
const BAR_STYLE = "fill:#cb7f6e; stroke:#232670; stroke-width:10;"
let groupBounds

document.addEventListener('DOMContentLoaded', function(){
  // just to get rid of the drawer
  collapseRight()

  let menu = s.rect(0, (sur.outerHeight() - 150), sur.outerWidth(), 150)
  menu.attr({
    fill: BLUEPRINT_BGD,
    stroke: 'lightgrey',
    strokeWidth: 4
  })
  MXY = menu.getBBox();
  console.log(MXY);
  let itemW = (MXY.w / items.length) - 120
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

    dragGroup = s.g()

    switch (this.desc) {
      case 'wall':
      case 'linewall':
        draggedObj = s.line(x -50 , y, x + 50, y);
        draggedObj.attr({
          x1: x -50,
          y1: y -200,
          x2: x + 50,
          y2: y -200,
          stroke: 'white',
          strokeWidth: 5
        })
        draggedObj.desc = 'linewall';
        draggedObj.alignment = 'horizontal';
        draggedObj.size = 100;
        draggedObj.drag(dragMove, dragStart, dragEnd)
        console.log(`mouseX: ${x}, mouseY: ${y}`);
        break;

      default:
        draggedObj = this.clone();
        draggedObj.desc = this.desc;
        dragGroup.desc = this.desc;
        dragGroup.dragCount = 0;
        dragGroup.draggedObj = draggedObj
        dragGroup.add(draggedObj);
        break;
    }



    dragGroup.drag(dragMove, dragStart, dragEnd)
    //adds drag offset properties for the group -- this is necessary to ensure proper translation during dragMove()
    dragGroup.dragData = {'ox':0, 'oy':0, 'x' : 0, 'y':0}

    //give a clonable property both to the menu icon as well as the group, so that it doesn't get duplicated
    draggedObj.clonable = false;
    dragGroup.clonable = false;
  }

  else {
    //console.log("NOT CLONED")

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

  //for the initial drag event from menu to SVG
  this.dragCount++;
  this.resizing = false;
  if (this.clonable){
    switch (this.desc) {
      case 'wall':
      case 'linewall':
        draggedObj.attr({
          x1: x -50,
          y1: y - 205,
          x2: x + 50,
          y2: y -205 // where 200 is header height (rethink)
        });
        break;

      default:
        //console.log("MOVING AFTER CLONING")
        draggedObj.attr({
          x: x - (5 + this.attr().width/2), // where 5 is the body margin
          y: y - (200 + this.attr().height/2) // where 200 is header height (rethink)
        });
        break;
    }
  }
  //To move elements in the SVG once they have already been placed
  else{
    //console.log("JUST MOVING")

    switch (this.desc) {
      case 'wall':
      case 'linewall':
        if (this.alignment === 'horizontal'){
          this.attr({
            x1: (x - (this.size / 2)),
            y1: y - 205,
            x2: (x + (this.size / 2)),
            y2: y - 205 // where 200 is header height (rethink)
          });
        }
        else {
          // TODO: Vertical alignmnent
        }
        break;

      default:
        //if offset properties are set, use them, otherwise (on first drag) use only the dx and dy properties
        if (this.dragData != null){
          this.attr({
              transform: `t${dx + this.dragData.ox},${dy + this.dragData.oy}`
          });
          /*This holds the dx and dy properties that will be added to the overall offset properties
          in the dragEnd() method*/
          this.dragData.x = dx;
          this.dragData.y = dy;
        }
        else{
          this.attr({
              transform: `t${dx},${dy}`
          });
        }
        //console.log(`${dx},${dy}`)
        break;
    }
  }
}

function dragEnd(ev) {

  console.log("DRAG END!!")
  /*//FOR TESTING
  console.log("THIS -->" + this.desc)
  console.log("Current -->" + currentDragged)
  if (this.dragData != null){
    console.log(this.dragData.ox)
  }*/

  //Apply the dx and dy properties from the dragMove() method to the overall offset
  if (this.dragData != null && !this.resizing){
    console.log("ADDING OFFSETS")

    this.dragData.ox2 = this.dragData.ox;
    this.dragData.oy2 = this.dragData.oy;

    this.dragData.ox += this.dragData.x
    this.dragData.oy += this.dragData.y

    /*console.log(this.dragData.x)
    console.log(this.dragData.y)
    console.log(this.dragData.ox)
    console.log(this.dragData.oy)*/
  }
  /*else if (this.resizing){
    this.dragData.ox -= this.dragData.x
    this.dragData.oy -= this.dragData.y
  }*/
  this.resizing = true;

  // if the mouse ptr is in the drawboard region on release, add an item
  if (ev.clientX > 50 && ev.clientX < sur.outerWidth() && ev.clientY < (sur.outerHeight() - 280) && ev.clientY > 258){

    console.log(this.desc)

    switch (this.desc) {

      case 'wall':
      case 'linewall':
        if (!this.dblclickSet)
          this.dblclick(a => configModal(this));
        this.dblclickSet = true;
        break;

      case 'table':
        if (!this.dblclickSet){
          this.dblclick(a=>configTable(this))
        }
        this.dblclickSet = true;
        break;

      case 'kitchen':
        if (!this.dblclickSet){
          this.dblclick(b=>configGenericBlock(this))
        }
        this.dblclickSet = true;
        break;

      case 'bar':
        if (!this.dblclickSet){
          this.dblclick(b=>configGenericBlock(this))
        }
        this.dblclickSet = true;
        break;

      case 'restroom':
        if (!this.dblclickSet){
          this.dblclick(b=>configGenericBlock(this))
        }
        this.dblclickSet = true;
        break;

    }
  }
  else{
    //console.log("REMOVING")

    //if you move an existing object out of bound, bring back to last recorded coordinates (using the last... properties)
    /*if (!this.clonable){

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
    }*/
  }
}

//Create Dialog box for the Wall Object
function configModal(item){
  let modal = $('<div>').addClass('modal').attr('id', 'modal');
  let content = $('<div>').attr('id', 'wallConfig').addClass('modal-content');

  content.append(configItem('size', 'number'));
  content.append(configItem('thickness', 'number'));
  content.append(configItem('alignment', 'radio', item));
  content.append(configButton(modal, "delete", item))
  content.append(configButton(modal, "close"))
  content.append(configButton(modal, "saveWall", item))

  modal.append(content);
  $('body').append(modal);

  removeIfClickedOutside(modal)

}

//Configure Inputs within the dialog boxes
function configItem(label, type, item) {
  let uLabel = capitalize(label);
  let option = $('<div>').attr('id', label);

  if (type !== 'radio'){
    option.append($('<input>').attr('type', type).attr('id', `item${uLabel}`).attr('id', `item${uLabel}`))
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

//Configure Diaglog box for the Table Object
function configTable(item){

  //console.log("CREATING FORM")

  let modal = $('<div>').addClass('modal');
  let content = $('<div>').addClass('modal-content');

  content.append(configItem('seats', 'number'));
  content.append(configItem('position', 'radio'));
  content.append(configButton(modal, "saveTable", item))
  content.append(configButton(modal, "close", null))

  modal.append(content);
  $('body').append(modal);

  removeIfClickedOutside(modal)
}

//Configure Diaglog box for the Kitchen Object
function configGenericBlock(item){

  console.log("KITCHEN Modal create")

  let modal = $('<div>').addClass('modal');
  let content = $('<div>').addClass('modal-content');

  content.append(configItem('length', 'number'));
  content.append(configItem('height', 'number'));
  content.append(configButton(modal, "saveKitchen", item))
  content.append(configButton(modal, "close", null))

  modal.append(content);
  $('body').append(modal);

  removeIfClickedOutside(modal)
}

//Configure buttons and action listeners for the buttons in the dialog boxes
function configButton(modal, type, item) {
  console.log(`TYPE: ${type}`)
  let button;
  if (type=="close"){
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.on("click", e=> modal.remove())
  }

  else if (type == "saveTable"){
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.on("click", e=>{
      item.seats = $('#itemSeats').val()
      if ($('#hAlign').is(':checked')){
        item.horizontal = true;
      }
      else{
        item.horizontal = false;
      }
      let table = createTableGraphic(item)
      modal.remove()
    })
  }


  else if (type == "saveWall"){
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.on("click", e=>{
      let size = $('#itemSize').val()
      let thiccness = $('#itemThickness').val()

      if ($('#hAlign').is(':checked') || $('#vAlign').is(':checked')){
        item.alignment = $('#hAlign').is(':checked') ? 'horizontal' : 'vertical'
      }

      if (size !== '' && item.alignment === 'horizontal'){
        let lineCenter = +item.attr().x1 + (item.size / 2)
        item.attr({
          x1: lineCenter - (size / 2),
          x2: lineCenter + (size / 2),
          y2: +item.attr().y1,
          strokeWidth: thiccness !== '' ? thiccness : +item.attr().strokeWidth
        })
        item.size = size //save the new size if not null
      }
      else if (size !== '' && item.alignment === 'vertical'){
        let lineCenter = +item.attr().y1 + (item.size / 2)
        item.attr({
          y1: lineCenter - (size / 2),
          y2: lineCenter + (size / 2),
          x2: +item.attr().x1,
          strokeWidth: thiccness !== '' ? thiccness : +item.attr().strokeWidth
        })
        item.size = size //save the new size if not null
      }
      $('#modal').remove() // closes the modal
    })
  }

  else if (type === 'delete'){
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.click(e => {
      item.remove()
      $('#modal').remove()
    })
  }
  else{
    button = $('<button>').addClass("modalButton").text(capitalize(type))
    button.on("click", event=>{
      console.log("SAVE KITCHEN BUTTON PRESSED")
      console.log($('#itemLength').val())
      console.log($('#itemHeight').val())
      item.length = $('#itemLength').val()
      item.width = $('#itemHeight').val()
      createGenericBlock(item)
      modal.remove()
      console.log("SAVE KITCHEN BUTTON ENDED")
    })
  }

  console.log(button)
  return button;
}

//Change the graphic for the table depending on the seats available
function createTableGraphic(group){
  console.log(`Dragged: ${group.dragCount}`)

  groupBounds = group.getBBox()

  //console.log(group)
  if (group.resizing != null){
    console.log(group.resizing)
  }
  let seats = group.seats;
  if (seats%2 !== 0){
    seats++; //want an even number
  }

  let offsetX = group.dragData.x, offsetY = group.dragData.y

  if (group.dragData.ox2 != null){
    offsetX += group.dragData.ox2;
    offsetY += group.dragData.oy2;
  }


  console.log(groupBounds)
  group.clear()
  let rect;
  if (!group.horizontal){
    rect = group.rect(groupBounds.x - offsetX, groupBounds.y - offsetY ,100,(seats/2) * 100, 15, 15)
    .attr({
      style:TABLE_STYLE
    })
  }
  else{
    rect = group.rect(groupBounds.x - offsetX, groupBounds.y  - offsetY , (seats/2) * 100,100, 15, 15)
  .attr({
      style:TABLE_STYLE
    })
  }
  //console.log(rect)
  groupBounds = rect.getBBox()
  group.circle(groupBounds.cx, groupBounds.cy, 40)
    .attr({
      style:"stroke:#363ba0;fill:white;stroke-width:5;"
    })
  group.text(groupBounds.cx-11, groupBounds.cy+12, seats)
    .attr({
      style:"font-weight:bold;font-size:40px;text-align:left;text-color:#363ba0;"
    })

    console.log(group.dragData.x)
    console.log(group.dragData.y)
    console.log(group.dragData.ox)
    console.log(group.dragData.oy)

  group.resizing = true;


}

//Create Kitchen object on SVG
function createGenericBlock(block){

  let bbox = block.getBBox()

  console.log(block)
  console.log(bbox)
  console.log(block.length)
  console.log(block.width)

  let iconW;
  let iconH;

  if (block.width < 140){
    iconW = 90;
    iconH = 90;
  }
  else{
    iconW = 130;
    iconH = 130;
  }

  block.clear()

  let rect
  console.log(block.desc)
  if(block.desc == "bar"){
    rect = block.rect(bbox.x - block.length/2, bbox.y - block.width/2 + 200, block.length, block.width, 15, 15).attr({style:BAR_STYLE})
  }
  else{
    rect = block.rect(bbox.x - block.length/2, bbox.y - block.width/2 + 200, block.length, block.width, 15, 15).attr({style:KITCHEN_STYLE})
  }

  bbox = rect.getBBox()

  switch(block.desc){
    case "kitchen":
      block.image(`../images/kitchen2.png`, bbox.cx - iconW/2, bbox.cy - iconH/2, iconW, iconH);
      break;
    case "restroom":
      block.image(`../images/restroom2.png`, bbox.cx - iconW/2, bbox.cy - iconH/2, iconW, iconH);
      break;
    case "bar":
      block.image(`../images/bar2.png`, bbox.cx - iconW/2, bbox.cy - iconH/2, iconW, iconH)
      block.attr({
        style:BAR_STYLE
      });
      break;
  }


}

function getBBox() {
  console.log(s);
}

//Collapse menu on the right
function collapseRight(ev) {
  let img = $('#collexpand')

  // IF EXPANDED
  if (img.attr('src').includes('collapse')){
    img.attr('src', './images/hamburger.png');
    $('#lib-container').css('width', '45px').addClass("dismiss").removeClass("selected");
    $('#svg0').attr('width', 'calc(100% - 50px)');
  }

  // IF COLLAPSED
  else {
    img.attr('src', './images/collapse.png');
    $('#lib-container').css('width', '19.65%').addClass("selected").removeClass("dismiss");
    $('#svg0').attr('width', '80%');
  }
}

//Capitalize first letter of string
function capitalize(str) {
    return str[0].toUpperCase() + str.slice(1);
}

//Simple functions that close the dialog box if click outside of the dialog box
function removeIfClickedOutside(modal){
  //if you click anywhere outside of the dialog box (modal), it will close
  window.onclick = function(event) {
    // Note: modal is a Jquery object, to compare you must take the JS object using get(0)
    if (event.target == modal.get(0)) {
        modal.remove();
    }
  }
}

var windowScroll = function() {
  var lastScrollTop = 0;

  $(window).scroll(function(event){

      var header = $('#fh5co-header'),
      scrlTop = $(this).scrollTop();

    if ( scrlTop > 200) {
      //if scroll is outside of the home area, fix nav bar to the top of the page -- written by Yev
      console.log("LOWER")
      header.addClass('navbar-hidden fh5co-animated fadeOutUp');
      header.removeClass('fadeInDown');
    } else{
      console.log("UPPER")
      header.addClass('navbar-fixed-top fh5co-animated fadeInDown')
      header.removeClass('navbar-hidden fadeOutUp');
    }

  });
};

$(function(){
  windowScroll();
});
