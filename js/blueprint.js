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
<<<<<<< HEAD
    let icon = g.image(`../images/${items[i]}.svg`, MXY.x, MXY.y + 10, itemH, itemH)

/*    let itemFrame = s.rect(MXY.x, MXY.y + 10, itemW, itemH, 5, 5);
    itemFrame.attr({
      x: ix,
      fill:'#363ba0'
    })
    g.add(itemFrame);
    */
    icon.attr({
      x: ix,
      padding: 20
    })

    // load the icons
/*    Snap.load(`./images/${items[i]}.svg`, frag => {
      console.log(g);
      console.log(frag);
      g.add(frag)
      let lskd = g.select('svg')
      let asd = Snap.parse(lskd)
      console.log(asd);
      lskd.attr({
        height:200,
        width:200
      });
    })*/

    icon.drag(dragMove,dragStart,dragEnd)
=======
    let icon = g.image(`../images/${items[i]}.png`, ix, MXY.y + 10, itemH, itemH)

    // Add drag(dragMove, dragStart, dragEnd) event
    icon.drag(dragMove, dragStart, dragEnd)
    icon.desc = items[i];
>>>>>>> 38113fe3b7c2a1d496f6cbc8fb5aa38b85d759cb
  }
});

function dragStart(x, y, ev) {
<<<<<<< HEAD
  console.log("DragStart");
  let newElement = this.clone()
  this.attr({
    fill:'blue'
  })
}

function dragMove(dx, dy, x, y, ev) {
  console.log("DragMove");
  this.attr({
    fill:'orange',
    x: x-100,
    y: y-200
  })
=======
  // duplicates the icon
  draggedObj = this.clone();
}

function dragMove(dx, dy, x, y, ev) {
  // just so the mouse ptr is in the middle of the icon
  draggedObj.attr({
    x: x - (5 + this.attr().height/2), // where 5 is the body margin
    y: y - (200 + this.attr().width/2) // where 200 is header height (rethink)
  });
>>>>>>> 38113fe3b7c2a1d496f6cbc8fb5aa38b85d759cb
}
function dragEnd(ev) {
  // removes the icon from the screen
  draggedObj.remove();

  // if the mouse ptr is in the drawboard region on release, add an item
  if (ev.clientX > 0 && ev.clientX < sur.outerWidth() && ev.clientY < (sur.outerHeight() - 150)){
    console.log(this.desc);

  }


<<<<<<< HEAD
function dragEnd() {
  console.log("DragEnd");
  this.attr({
    fill:'black'
  })
=======
>>>>>>> 38113fe3b7c2a1d496f6cbc8fb5aa38b85d759cb
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
