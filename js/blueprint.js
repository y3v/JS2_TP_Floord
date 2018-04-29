'use strict';
const BLUEPRINT_BGD = '#363ba0'

let s = Snap('#svg0');
let sur = $('#svg0')
let drb = $('#drawboard')
let shapes = []
let items = ['wall', 'door', 'restroom', 'kitchen', 'table', 'bar']
let colored = false;
let MXY = {}

document.addEventListener('DOMContentLoaded', function(){
  let menu = s.rect(0, (sur.outerHeight() - 150), sur.outerWidth(), 150)
  menu.attr({
    fill: 'lightGrey'/*,
    stroke: 'black',
    strokeWidth: 4*/
  })
  MXY = menu.getBBox();
  console.log(MXY);
  let itemW = (MXY.w / items.length) - 10
  let itemH = MXY.h - 20

  // add all the elements to the menu
  for (var i = 0; i < items.length; i++) {
    let g = s.group();
    let itemFrame = g.rect(MXY.x, MXY.y + 10, itemW, itemH, 5, 5);
    let ix = i === 0 ? 5 :(i * (itemW + 10)) + 5
    let icon = s.image(`../images/${items[i]}.png`, 50,50,50,50)

    itemFrame.attr({
      x: ix,
      fill:'#363ba0'
    })

    //g.add(itemFrame);
    g.add(icon)
    console.log(icon.attr());

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
  }
});



function dragStart(x, y, ev) {
  this.attr({
    fill:'blue'
  })
}

function dragMove(dx, dy, x, y, ev) {
  this.attr({
    fill:'orange',
    cx: x -5,
    cy: y -205
  })
}

function dragEnd() {
  this.attr({
    fill:'black'
  })
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

function placeImage(fragment) {
  console.log(fragment);
}
