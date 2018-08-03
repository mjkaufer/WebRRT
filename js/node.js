// node.js amirite
class Node {
	constructor(x, y) {
		this.x = x
		this.y = y
		this.parent = undefined
		this.twoReference = undefined
		this.lineToParentReference = undefined
	}

	distanceSquared(node) {
		return Math.pow(this.x - node.x, 2) + Math.pow(this.y - node.y, 2)
	}

	closest(nodeList, obstacles) {
		if (nodeList.length == 0) {
			return undefined
		}

		if (nodeList.length == 1) {
			return nodeList[0]
		}

		let bestIndex = -1
		let bestDistance = -1

		for (let i = 0; i < nodeList.length; i++) {

			let currentDistance = this.distanceSquared(nodeList[i])

			if (currentDistance < bestDistance || bestIndex == -1) {
				bestDistance = currentDistance
				bestIndex = i
			}
		}

		if (bestIndex == -1) {
			return undefined
		}

		return nodeList[bestIndex]
	}

	projectToNode(node, maxDistance) {
		const distanceSquared = this.distanceSquared(node)
		if (distanceSquared <= maxDistance * maxDistance) {
			return node
		}

		const distance = Math.sqrt(distanceSquared)

		const dx = (node.x - this.x) / distance * maxDistance
		const dy = (node.y - this.y) / distance * maxDistance

		return new Node(this.x + dx, this.y + dy)
	}

	add(x, y) {
		return new Node(this.x + x, this.y + y)
	}

	sub(nodeToSubtract) {
		return new Node(this.x - nodeToSubtract.x, this.y - nodeToSubtract.y)
	}

	abs() {
		return new Node(Math.abs(this.x), Math.abs(this.y))
	}

	toString() {
		return `Node[x=${this.x}, y=${this.y}]`
	}
}