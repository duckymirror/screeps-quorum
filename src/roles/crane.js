'use strict'

const MetaRole = require('roles_meta')

const uniqueCoreStructures = [
    STRUCTURE_CONTROLLER,
    STRUCTURE_NUKER,
    STRUCTURE_OBSERVER,
    STRUCTURE_POWER_SPAWN,
    STRUCTURE_STORAGE,
    STRUCTURE_TERMINAL
]

class Crane extends MetaRole {
    getBuild(room, options) {
        this.setBuildDefaults(room, options)
        return Creep.buildFromTemplate([MOVE, CARRY, CARRY, CARRY, WORK], options.energy)
    }

    manageCreep(creep) {
        if (creep.ticksToLive < 50) {
            return creep.recycle()
        }

        const pos = creep.room.getLayout().getAllStructures()[STRUCTURE_CRANE][0]
        if (creep.pos !== pos) {
            creep.travelTo(pos)
            return
        }

        if (!creep.memory.structures) {
            creep.memory.structures = {}
        }
        if (!creep.memory.structures.terminal) {
            const terminal = this.findUniqueStructure(creep.pos.roomName, STRUCTURE_TERMINAL)
            if (terminal) {
                creep.memory.structures.terminal = terminal.id
            }
        }
        const link = this.findStructure(creep.pos, STRUCTURE_LINK)
        const spawn = this.findStructure(creep.pos, STRUCTURE_SPAWN)
        const storage = this.findUniqueStructure(creep.pos.roomName, STRUCTURE_STORAGE)
    }

    /**
     * Finds the structure of the given type near the given crane structure position.
     * @param {RoomPosition} pos The position of the crane structure.
     * @param {Number} type The type of structure to find.
     * @returns {Structure | false} Returns the structure if it was found and false if it wasn't.
     */
    findStructure(pos, type) {
        const structure = pos.lookAroundFor(type)
        if (structure && structure[0]) {
            return structure[0][2]
        }
        return false
    }

    /**
     * Finds core structures which can only exist one time in every room.
     * @param {String} roomName
     * @param {Number} type
     */
    findUniqueStructure(roomName, type) {
        if (!uniqueCoreStructures.indexOf(type) > -1) {
            return false
        }
        const structures = Game.rooms[roomName].structures[type]
        return (structures && structures[0])
            ? structures[0]
            : false
    }
}