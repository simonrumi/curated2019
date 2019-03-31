const directions = {
  'east': {
    'vector': [1,0],
    'range': [-1/8 * Math.PI, 1/8 * Math.PI],
    'html': '<img src="/img/arrowE.png"/>',
  },
  'northeast': {
    'vector': [1,1],
    'range': [1/8 * Math.PI, 3/8 * Math.PI],
    'html': '<img src="/img/arrowNE.png" class="align-right"/>',
  },
  'north': {
    'vector': [0,1],
    'range': [3/8 * Math.PI, 5/8 * Math.PI],
    'html': '<img src="/img/arrowN.png"/>',
  },
  'northwest': {
    'vector': [-1, 1],
    'range': [5/8 * Math.PI, 7/8 * Math.PI],
    'html': '<img src="/img/arrowNW.png" class="align-left"/>',
  },
  'west': {
    'vector': [-1,0],
    'range': [-7/8 * Math.PI, 7/8 * Math.PI],
    'html': '<img src="/img/arrowW.png" class="align-left"/>',
  },
  'southwest': {
    'vector': [-1,-1],
    'range': [-7/8 * Math.PI, -5/8 * Math.PI],
    'html': '<img src="/img/arrowSW.png" class="align-left"/>',
  },
  'south': {
    'vector': [0,-1],
    'range': [-5/8 * Math.PI, -3/8 * Math.PI],
    'html': '<img src="/img/arrowS.png"/>',
  },
  'southeast': {
    'vector': [1,-1],
    'range': [-3/8 * Math.PI, -1/8 * Math.PI],
    'html': '<img src="/img/arrowSE.png" class="align-right"/>',
  },
}
