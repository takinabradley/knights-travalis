function ListNode(value) {
  const node = Object.create(null)
  node.next = null
  node.value = value
  return node
}

function Queue() {
  let front = null
  let rear = null
  let length = 0

  function enqueue(value) {
    const newNode = ListNode(value)
    if(rear === null) {
      //if queue is empty, set front and rear to the only node
      front = newNode
      rear = newNode
      length++
      return
    }
    rear.next = newNode
    rear = newNode
    length++
  }

  function dequeue() {
    if(front === null) {
      //if empty, return nothing
      return null
    } else if(front.next === null) {
      // if it's the last item, return the last item and set pointers to null
      const value = front.value
      rear = null
      front = null
      length--
      return value
    } else {
      // otherwise, pop the last value off the queue and set front to next node
      const value = front.value
      front = front.next
      length--
      return value
    }
  }

  return Object.create(null, {
    enqueue: {enumerable: true, value: enqueue},
    dequeue: {enumerable: true, value: dequeue},
    front: {enumerable: true, get() {return front}},
    rear: {enumerable: true, get() {return rear}},
    length: {enumerable: true, get() {return length}}
  })
}

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

const isOutOfBounds = (coords, boardWidth) => {
  /* coords are 0-indexed, so we need to subtract one from board width */
  boardWidth = boardWidth - 1

  const x = coords[0]
  const y = coords[1]
  if( x < 0 || x > boardWidth) return true
  if( y < 0 || y > boardWidth) return true
  return false
}

/*
  Maximum amount of moves it should take to get from one side of the board to 
  the other for a board with a width greater than 4:
  https://oeis.org/A232007 
*/
const maxMoves = (boardWidth) => Math.ceil((2 * boardWidth) / 3)

function graphAllPossibleMoves(currentPosition, boardWidth, count = 0) {
  if(Array.isArray(currentPosition)) {
    currentPosition = GraphNode(currentPosition)
  }

  if(count >= maxMoves(boardWidth)) return currentPosition
  allPossibleMoves.forEach(move => {
    const nextPosition = GraphNode([currentPosition.value[0] + move[0], currentPosition.value[1] + move[1]])
    if(!isOutOfBounds(nextPosition.value, boardWidth)) {
      currentPosition.children.push(nextPosition)
      graphAllPossibleMoves(nextPosition, boardWidth, count + 1)
    }
  })
  return currentPosition
}

function breadthFirstSearch(tree, value) {
  const queue = Queue()
  queue.enqueue(tree)

  while(queue.length) {
    const node = queue.dequeue()
    if(coordsAreEqual(node.value, value)) {
      return node
    } else if (node.children.length) {
      node.children.forEach(child => queue.enqueue(child))
    }
  } 
}

function depthFirstPathToNode(tree, node, path = [tree]) {
  if(tree === node) return path
  if(!tree.children.length) return

  let foundPath;
  for (const child of tree.children ) {
    foundPath = depthFirstPathToNode(child, node, [...path, child])
    if(foundPath) return foundPath
  }
}

function pathToDestination(start, end, boardWidth) {
  const tree = graphAllPossibleMoves(start, boardWidth)
  const closestNodeMatchingEnd = breadthFirstSearch(tree, end)
  const pathFromStartToEnd = depthFirstPathToNode(tree, closestNodeMatchingEnd)
  return pathFromStartToEnd
}