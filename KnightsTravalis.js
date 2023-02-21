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
    currentPosition = GraphNode(currentPosition)
    path = [currentPosition.value]
  }

  if (coordsAreEqual(currentPosition.value, destination)) return {count: count, path, info: 'was equal to current position'}
  if(count > 6) return {count: -1}

  allPossibleMoves.forEach((move) => {
    const nextPosition = [currentPosition.value[0] + move[0], currentPosition.value[1] + move[1]];
    if (!isOutOfBounds(nextPosition)) currentPosition.children.push(GraphNode(nextPosition));
  });

  console.log([...currentPosition.children])
  const foundInChildren = currentPosition.children.find((coord) => coordsAreEqual(coord.value, destination))
  if(foundInChildren) return {count: count + 1, path: [...path, destination], info: 'found in children'}

  let countArray = [];
  currentPosition.children.forEach((move) => {
    if(isInPath(move.value, path)) return // maybe this makes it faster?
    countArray.push(findDestination({...move}, destination, count + 1, [...path, move.value]));
  });

  countArray.sort( (a, b) => {
    if(a.count > b.count) return 1
    if(a.count < b.count) return -1
    return 0
  });

  countArray = countArray.reduce( (array, item) => {
    if(item.count < 0) return array
    return [...array, item]
  }, [])
  console.log('countarray', countArray)
  if(countArray.length === 0) return {count: -1}
  return countArray[0];
}