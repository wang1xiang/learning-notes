function List() {
  this.listSize = 0
  this.pos = 0
  this.dataStore = []
  this.find = find
  this.toString = toString
  this.append = append
  this.remove = remove
  this.length = length
  this.clear = clear
  this.insert = insert
  this.contains = contains
  this.front = front
  this.end = end
  this.next = next
  this.prev = prev
  this.hasNext = hasNext
  this.hasPrev = hasPrev
  this.curPos = curPos
  this.moveTo = moveTo
  this.getElement = getElement
}

function append(ele) {
  this.dataStore[this.listSize++] = ele
}
function find(ele) {
  const length = this.dataStore.length
  for (let i = 0; i < length; i++) {
    if (this.dataStore[i] === ele) return i
  }
  return -1
}
function remove(ele) {
  let foundAt = this.find(ele)
  if (foundAt > -1) {
    this.dataStore.splice(foundAt, 1)
    --this.listSize
    return true
  }
  return false
}
function length() {
  return this.listSize
}
function toString() {
  return this.dataStore
}
function clear() {
  this.dataStore = []
  this.listSize = this.pos = 0
}
function insert(ele, after) {
  const insertPos = this.find(after)
  if (insertPos > -1) {
    this.dataStore.splice(insertPos + 1, 0, ele)
    ++this.listSize
    return true
  }
  return false
}
function contains(ele) {
  const length = this.dataStore.length
  for (let i = 0; i < length; i++) {
    if (this.dataStore[i] === ele) return true
  }
  return false
}
function front() {
  this.pos = 0
}
function end() {
  this.pos = this.listSize - 1
}
function prev() {
  --this.pos
}
function next() {
  this.pos < this.listSize && ++this.pos
}
function curPos() {
  return this.pos
}
function moveTo(position) {
  this.pos = position
}
function getElement() {
  return this.dataStore[this.pos]
}
function hasNext() {
  return this.pos < this.listSize
}
function hasPrev() {
  return this.pos >= 0
}
let names = new List()
names.append('1')
names.append('2')
names.append('3')
names.append('4')
names.append('5')
names.append('6')
console.log(names)
names.remove('3')
console.log(names)
names.front()
console.log(names)
names.next()
console.log(names.getElement())
console.log(names)
