'use strict';

let s = Snap('#svg0');
let sur = $('#svg0')
let drb = $('#drawboard')
let shapes = []
let items = ['Table', 'Counter', 'Front desk', 'Door', 'Bathroom', 'Kitchen', 'Bar', 'Wall']
let colored = false;
let MXY = {}

document.addEventListener('DOMContentLoaded', function(){
  let menu = s.rect(0, (sur.outerHeight() - 150), sur.width(), 150)
  menu.attr({
    fill: 'lightGrey'/*,
    stroke: 'black',
    strokeWidth: 4*/
  })
  MXY = menu.getBBox();
  console.log(MXY);
  let itemW = (MXY.w / items.length) - 10
  let itemH = MXY.h - 20

  for (var i = 0; i < items.length; i++) {
    let g = s.group();
    let ifr = s.rect(MXY.x, MXY.y + 10, itemW, itemH);
    let ix = i === 0 ? 5 :(i * (itemW + 10)) + 5


    ifr.attr({
      x: ix
    })
    g.add(ifr);
    Snap.load('./images/18plus.svg', frag => {
      console.log(g);
      g.add(frag)
      let lskd = g.select('svg')
      lskd.attr({
        height:10,
        width:10
      })
      console.log();
    })
  }
  s.text(MXY.x, MXY.y, 'heyyy')

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
