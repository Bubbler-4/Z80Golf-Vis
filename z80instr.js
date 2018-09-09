class Z80Instr {
  static decode(memory, pc) {
    let instr = z80instr
    while (!instr.op) {
      let opcode = memory[pc]
      pc = (pc + 1) & 0xffff
      instr = instr[opcode]
    }
    return { instr: instr, pc: pc }
  }
}

(function() {
  let z80instr = Array(256).fill({ op: 'nop' })
  z80instr[0x76] = { op: 'halt' }
  window.z80instr = z80instr
})()
