const circleRadius = 7
const lineWidth = 3
const finishedLineWidth = 4
const strokeColor = "#2ed573"
const goalStrokeColor = "#2f3542"
const fillColor = "#f1f2f6"
const finishedStrokeColor = "#1e90ff"
const goalThreshold = 0.90
const maxDistance = 60
const searchSpeed = 100
const animateFinishSpeed = 50
const smoothSpeed = 200
const maxSmoothAttempts = 100

// todo, consider a min distance so the UI doesn't get clogged & gross
const minDistance = 5

class RRT {
	constructor(two, startNode, goalNode) {
		this.nodeList = []
		this.obstacles = []
		this.two = two
		this.startNode = startNode
		this.goalNode = goalNode
		this.drawNode(goalNode)
		this.addNode(startNode)
		this.doneSearching = false
		this.editable = true
		this.lastClickNode = null

		let self = this

		document.body.onmousedown = function(event) {
			if (event.shiftKey) {
				return
			}
			let clickPositionNode = new Node(event.pageX, event.pageY)
			if (self.lastClickNode === null) {
				self.lastClickNode = clickPositionNode
			} else {
				if (self.editable) {
					let delta = clickPositionNode.sub(self.lastClickNode).abs()
					let leftNode = self.lastClickNode
					let rightNode = clickPositionNode

					if (clickPositionNode.x < leftNode.x) {
						leftNode = clickPositionNode
						rightNode = self.lastClickNode
					}

					if (leftNode.y > rightNode.y) {
						let temp = leftNode.y
						leftNode.y = rightNode.y
						rightNode.y = temp
					}

					self.addObstacle(new Obstacle(self.two, leftNode, delta.x, delta.y))
					self.lastClickNode = null
				}
			}
		}
	}

	addObstacle(obstacle) {
		let self = this
		let obstacleIndex = self.obstacles.push(obstacle)

		document.getElementById(obstacle.twoRepresentation.id).onclick = function(event) {
			if (event.shiftKey && self.editable) {
				obstacle.twoRepresentation.remove()
				self.obstacles.splice(obstacleIndex, 1)
				two.update()
			}
		}
	}

	randomPoint() {
		if (Math.random() > goalThreshold) {
			return this.goalNode
		}

		return new Node(Math.random() * two.width, Math.random() * two.height)
	}

	drawNode(node) {
		node.twoReference = this.two.makeCircle(node.x, node.y, circleRadius)
		node.twoReference.stroke = node === this.goalNode ? goalStrokeColor : strokeColor
		node.twoReference.fill = fillColor
		node.twoReference.linewidth = lineWidth
	}

	addNode(node) {
		if (this.nodeList.length === 0) {
			this.drawNode(node)
			this.nodeList.push(node)
			return undefined
		}

		// closest node w/out collision
		const closestNodeInList = node.closest(this.nodeList, this.obstacles)

		// collision
		if (closestNodeInList === undefined) {
			return undefined
		}

		const projectedNode = closestNodeInList.projectToNode(node, maxDistance)

		let intersects = this.obstacles.some(function(obstacle) {
			return obstacle.intersects(closestNodeInList, projectedNode)
		})

		if (intersects) {
			return undefined
		}

		this.nodeList.push(projectedNode)

		if (projectedNode !== this.goalNode) {
			this.drawNode(projectedNode)	
		}

		this.connect(closestNodeInList, projectedNode)
		this.two.update()

		return projectedNode
	}

	connect(parentNode, childNode) {
		childNode.parent = parentNode

		if (childNode.lineToParentReference) {
			childNode.lineToParentReference.remove()
		}

		childNode.lineToParentReference = this.two.makeLine(parentNode.x, parentNode.y, childNode.x, childNode.y)

		if (this.doneSearching) {
			childNode.lineToParentReference.stroke = finishedStrokeColor
			childNode.lineToParentReference.linewidth = finishedLineWidth
		} else {
			childNode.lineToParentReference.stroke = strokeColor
			childNode.lineToParentReference.linewidth = lineWidth
		}
	}

	startSearching() {
		this.editable = false
		// define a synonym because setInterval overrides this scope
		let self = this
		let interval = setInterval(function() {
			let addedNode = undefined
			do {
				// if an invalid point is picked, we don't have to wait x milliseconds to try again
				addedNode = rrt.addNode(rrt.randomPoint())
			} while (addedNode === undefined)

			if (addedNode === self.goalNode) {
				clearInterval(interval)
				self.finishSearch()
			}
			// TODO: if distance to goal node is less than max dist, just add goal node
		}, searchSpeed)
	}

	finishSearch() {
		this.doneSearching = true
		let self = this
		let currentNode = this.goalNode

		let interval = setInterval(function() {
			currentNode.twoReference.stroke = finishedStrokeColor
			currentNode.twoReference.linewidth = finishedLineWidth
			if (currentNode.lineToParentReference !== undefined) {
				currentNode.lineToParentReference.stroke = finishedStrokeColor
				currentNode.lineToParentReference.linewidth = finishedLineWidth
			}
			self.two.update()
			currentNode = currentNode.parent

			if (currentNode === undefined) {
				clearInterval(interval)
				self.cleanPath()
			}
		}, animateFinishSpeed)
	}

	cleanPath() {
		this.pruneNodes()
		this.smoothPath()
	}

	attemptSwap() {
		let randomIndices = [this.randomIndex(), this.randomIndex()]
		let minIndex = Math.min(...randomIndices)
		let maxIndex = Math.max(...randomIndices)

		if (maxIndex - minIndex <= 1) {
			return false
		}

		let self = this
		let collisions = this.obstacles.some(function(obstacle) {
			return obstacle.intersects(self.nodeList[minIndex], self.nodeList[maxIndex])
		})

		if (collisions) {
			return false
		}

		this.connect(this.nodeList[minIndex], this.nodeList[maxIndex])

		for (let i = maxIndex - 1; i > minIndex; i--) {
			let node = this.nodeList[i]
			this.nodeList.splice(i, 1)
			node.twoReference.remove()
			node.lineToParentReference.remove()
		}

		this.two.update()

		return true

	}

	randomIndex() {
		return parseInt(Math.random() * this.nodeList.length)
	}

	smoothPath() {
		let self = this
		let i = 0

		let interval = setInterval(function() {
			let result = false
			while (result == false && i < maxSmoothAttempts && self.nodeList.length > 2) {
				i++
				result = self.attemptSwap()
			}
			if (i > maxSmoothAttempts || self.nodeList.length <= 2) {
				clearInterval(interval)
			}
		}, smoothSpeed)
	}

	pruneNodes() {
		for (var i = this.nodeList.length - 1; i >= 0; i--) {
			var node = this.nodeList[i]
			if (node.twoReference.stroke !== finishedStrokeColor) {
				node.twoReference.remove()
				this.nodeList.splice(i, 1)
			}
			if (node.lineToParentReference && node.lineToParentReference.stroke !== finishedStrokeColor) {
				node.lineToParentReference.remove()
			}
		}
		two.update()
	}
}