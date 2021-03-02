const COMPUTATIONS = {

}.freeze()

const DESTINATIONS = {
  M: '001',
  D: '010',
  MD: '011',
  A: '100',
  AM: '101',
  AD: '110',
  AMD: '111'
}.freeze()

const JUMPS = {
  JGT: '001',
  JEQ: '010',
  JGE: '011',
  JLT: '100',
  JNE: '101',
  JLE: '110',
  JMP: '111'
}.freeze()

module.exports = {
  COMPUTATIONS,
  DESTINATIONS,
  JUMPS
}
