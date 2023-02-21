function GraphNode(value) {
  return Object.assign(Object.create(null), {
    value,
    children: [],
  });
}

const upwardMoves = [
  [2, -1],
  [2, 1],
  [1, 2],
  [1, -2],
];
const downwardMoves = upwardMoves.map((arr) => arr.map((value) => -value));
const allPossibleMoves = [...upwardMoves, ...downwardMoves];

const coordsAreEqual = (coord1, coord2) =>
  coord1[0] === coord2[0] && coord1[1] === coord2[1];

const isOutOfBounds = (coords) => {
  const x = coords[0]
  const y = coords[1]
  if( x < 0 || x > 7) return true
  if( y < 0 || y > 7) return true
  return false
}

const isInPath = (coord, path) => {
  const index = path.findIndex(pathCoord => coordsAreEqual(coord, pathCoord))
  return (index !== -1) ? true : false
}

function findDestination(currentPosition, destination, count = 0, path = []) {
  // FixMe! I'm slow :(
  if(Array.isArray(currentPosition)) {
    // if currentPosition is just an array of coords, turn it into a graph node
    currentPosition = GraphNode(currentPosition)
    path = [currentPosition.value]
  }

  // if the graph node's value is equal to the destination, return this path
  if (coordsAreEqual(currentPosition.value, destination)) return {count: count, path, info: 'was equal to current position'}

  // if count is greater than the maximum path length, return -1
  if(count > 6) return {count: -1}

  // add all possible, valid next move to the children of our graphnode
  allPossibleMoves.forEach((move) => {
    const nextPosition = [currentPosition.value[0] + move[0], currentPosition.value[1] + move[1]];
    if (!isOutOfBounds(nextPosition)) currentPosition.children.push(GraphNode(nextPosition));
  });

  // if our destination is in the children of our node, return that node
  const foundInChildren = currentPosition.children.find((coord) => coordsAreEqual(coord.value, destination))
  if(foundInChildren) return {count: count + 1, path: [...path, destination], info: 'found in children'}

  // create an array of paths with a 'count' score
  let countArray = [];
  currentPosition.children.forEach((move) => {
    if(isInPath(move.value, path)) return // maybe this makes it faster?
    countArray.push(findDestination({...move}, destination, count + 1, [...path, move.value]));
  });

  // sort paths by lowest score
  countArray.sort( (a, b) => {
    if(a.count > b.count) return 1
    if(a.count < b.count) return -1
    return 0
  });

  // remove all negative scores
  countArray = countArray.reduce( (array, item) => {
    if(item.count < 0) return array
    return [...array, item]
  }, [])

  // return nothing or path
  if(countArray.length === 0) return 
  return countArray[0];
}