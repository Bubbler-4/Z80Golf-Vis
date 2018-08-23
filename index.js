window.onload = function() {
      
  let hellowld = '2e0d3e48cd00807e23b720f876656c6c6f2c20776f726c6421'

  Number.prototype.hex = function(digits) {
    return this.toString(16).padStart(digits, 0)
  }

  // Ported from Z80Golf machine written in C.

  class Z80Reg {
    constructor() {
      this.word = 0
    }
    get high() { return this.word >> 8 }
    get low() { return this.word & 255 }
    set high(val) {
      this.word = ((val & 255) << 8) | (this.word & 255)
    }
    set low(val) {
      this.word = (this.word & 0xff00) | (val & 255)
    }
  }

  class Z80Golf {
    constructor() {
      this.memory = Array(65536)
      this.running = false
    }
    init(code=[], stdin=[]) {
      this.memory.fill(0)
      this.reg = {
        a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0,
        pc: 0, sp: 0, ix: 0, iy: 0
      }
      this.shadow = {
        a: 0, f: 0, b: 0, c: 0, d: 0, e: 0, h: 0, l: 0
      }
      code.forEach((v, i) => this.memory[i] = v, this)
      this.stdin = stdin
      this.stdout = []
      this.running = true
    }
    step() {
      if (this.stdout.length) this.running = false
      else this.stdout.push(65)
    }
  }

  let z80golf = new Z80Golf()

  let codeElem = $('#code')
  let stdinElem = $('#stdin')
  let stdoutElem = $('#stdout')
  let statusElem = $('#status')

  function z80reset() {
    try {
      let code = code2arr(codeElem.val())
      let stdin = input2arr()
      z80golf.init(code, stdin)
      statusElem.css('color', 'black')
      statusElem.text('Running.')
    } catch (e) {
      statusElem.css('color', 'red')
      statusElem.text(e)
    }
  }

  function z80step() {
    try {
      if (z80golf.running) {
        z80golf.step()
        arr2output()
      }
      if (!z80golf.running) {
        statusElem.css('color', 'black')
        statusElem.text('Halted.')
      }
    } catch (e) {
      statusElem.css('color', 'red')
      statusElem.text(e)
    }
  }

  window.z80reset = z80reset
  window.z80step = z80step

  let code2arr = code => (code.match(/../g) || []).map(n => parseInt(n, 16))

  function input2arr() {
    let input = stdinElem.val()
    let method = $('[name="in"]:checked')[0].id
    if (/plain/.test(method)) input = plain2arr(input)
    else if (/dec/.test(method)) input = dec2arr(input)
    else if (/hex/.test(method)) input = hex2arr(input)
    else throw 'Invalid input method.'
    if (!inputIsValid(input)) throw 'Invalid input values.'
    return input
  }

  let plain2arr = s => [...unescape(encodeURI(s))].map(c => c.charCodeAt())
  let dec2arr = s => (s.match(/\d+/g) || []).map(n => parseInt(n, 10))
  let hex2arr = s => (s.match(/[\da-fA-F]+/g) || []).map(n => parseInt(n, 16))
  let inputIsValid = a => a.every(n => n >= 0 && n < 256)

  function arr2output() {
    let method = $('[name="out"]:checked')[0].id
    let output = z80golf.stdout
    if (/plain/.test(method)) output = arr2plain(output)
    else if (/dec/.test(method)) output = arr2dec(output)
    else if (/hex/.test(method)) output = arr2hex(output)
    else throw 'Invalid output method.'
    stdoutElem.val(output)
  }

  let arr2plain = a => String.fromCharCode(...a)
  let arr2dec = a => a.join(' ')
  let arr2hex = a => a.map(n => n.hex(2)).join(' ')

  console.log(arr2hex([0, 1, 2, 16, 32, 255]))

}

