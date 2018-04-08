'use strict'

Object.defineProperty(Room.prototype, 'structures', {
  get: function () {
    if (!this._structures || _.isEmpty(this._structures)) {
      const allStructures = this.find(FIND_STRUCTURES)
      this._structures = _.groupBy(allStructures, 'structureType')
      this._structures.all = allStructures
    }
    return this._structures
  },
  enumerable: false,
  configurable: true
})

Room.prototype.getCraneStructures = function () {
    if (!this.__craneStructures) {
        this.__craneStructures = {}
        const layout = creep.room.getLayout()
        if (!layout) {
            return this.__craneStructures
        }
        const cranePos = layout.getAllStructures()[STRUCTURE_CRANE][0]

        this.__craneStructures.spawn = findStructureNear(cranePos, STRUCTURE_SPAWN)
    }
    return this.__craneStructures
}

/**
 * Finds the structure of the given type near the given crane structure position.
 * @param {RoomPosition} pos The position of the crane structure.
 * @param {Number} type The type of structure to find.
 * @returns {Structure | false} Returns the structure if it was found and false if it wasn't.
 */
function findStructureNear(pos, type) {
    const structure = pos.lookAroundFor(LOOK_STRUCTURES, {
        filter: function (structure) {
            return structure.structureType === type
        }
    })
    if (structure && structure[0]) {
        return structure[0][2]
    }
    return false
}