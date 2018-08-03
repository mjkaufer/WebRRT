const obstacleStroke = "#5352ed"
const obstacleFill = "#70a1ff"
const obstacleLineWidth = 10
const obstacleClassName = "obstacle"

class Obstacle {
	// all obstacles are rectangles; this defines two endpoints that create the rectangle
	constructor(two, topLeftNode, width, height) {
		this.topLeftNode = topLeftNode
		this.width = width
		this.height = height
		this.two = two
		this.twoRepresentation = two.makeRectangle(topLeftNode.x + width / 2, topLeftNode.y + height / 2, width, height)
		this.twoRepresentation.stroke = obstacleStroke
		this.twoRepresentation.fill = obstacleFill
		this.twoRepresentation.linewidth = obstacleLineWidth
		this.twoRepresentation.classList.push(obstacleClassName)
		two.update()
	}

	// determine if a line segment defined by two nodes intersects this obstacle
	intersects(lineSegmentStartNode, lineSegmentEndNode) {
		// vertices defined such that adjacent elements form the edges of the obstacle
		let vertices = [this.topLeftNode, this.topLeftNode.add(this.width, 0),
					 	this.topLeftNode.add(this.width, this.height), this.topLeftNode.add(0, this.height)]
		let intersects = false

		for (var i = 0; i < vertices.length; i++) {
			let firstElement = vertices[i]
			let secondElement = vertices[(i + 1) % vertices.length]
			let cross = isIntersect(firstElement, secondElement, lineSegmentStartNode, lineSegmentEndNode)
			intersects = intersects || cross

		}

		return intersects
	}
}

// // crosses function taken from http://jsfiddle.net/ytr9314a/4/
// function crosses(a,b,c,d){
// 	// Tests if the segment a-b intersects with the segment c-d. 
// 	// Ex: crosses({x:0,y:0},{x:1,y:1},{x:1,y:0},{x:0,y:1}) === true
// 	// Credit: Beta at http://stackoverflow.com/questions/7069420/check-if-two-line-segments-are-colliding-only-check-if-they-are-intersecting-n
// 	// Implementation by Viclib (viclib.com).
// 	var aSide = (d.x - c.x) * (a.y - c.y) - (d.y - c.y) * (a.x - c.x) > 0;
// 	var bSide = (d.x - c.x) * (b.y - c.y) - (d.y - c.y) * (b.x - c.x) > 0;
// 	var cSide = (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) > 0;
// 	var dSide = (b.x - a.x) * (d.y - a.y) - (b.y - a.y) * (d.x - a.x) > 0;
// 	return aSide !== bSide && cSide !== dSide;
// }

// adapted from https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
function Turn(p1, p2, p3) {
  a = p1.x; b = p1.y; 
  c = p2.x; d = p2.y;
  e = p3.x; f = p3.y;
  A = (f - b) * (c - a);
  B = (d - b) * (e - a);
  return (A > B + Number.EPSILON) ? 1 : (A + Number.EPSILON < B) ? -1 : 0;
}

function isIntersect(p1, p2, p3, p4) {
  return (Turn(p1, p3, p4) != Turn(p2, p3, p4)) && (Turn(p1, p2, p3) != Turn(p1, p2, p4));
}