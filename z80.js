Number.prototype.hex = function (digits) {
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

class Z80Chip {
	constructor() {
		['_af', '_bc', '_de', '_hl', '_pc', '_sp', '_ix', '_iy',
		 '_af_', '_bc_', '_de_', '_hl_'].forEach(
			reg => this[reg] = new Z80Reg(), this
		)
  }
  
  // Main 8-bit registers.

	get a() { return this._af.high }
	get f() { return this._af.low }
	get b() { return this._bc.high }
	get c() { return this._bc.low }
	get d() { return this._de.high }
	get e() { return this._de.low }
	get h() { return this._hl.high }
	get l() { return this._hl.low }
	get ixh() { return this._ix.high }
	get ixl() { return this._ix.low }
	get iyh() { return this._iy.high }
  get iyl() { return this._iy.low }

	set a(val) { this._af.high = val }
	set f(val) { this._af.low = val }
	set b(val) { this._bc.high = val }
	set c(val) { this._bc.low = val }
	set d(val) { this._de.high = val }
	set e(val) { this._de.low = val }
	set h(val) { this._hl.high = val }
	set l(val) { this._hl.low = val }
	set ixh(val) { this._ix.high = val }
	set ixl(val) { this._ix.low = val }
	set iyh(val) { this._iy.high = val }
	set iyl(val) { this._iy.low = val }
  
  // Main 16-bit registers.

	get af() { return this._af.word }
	get bc() { return this._bc.word }
	get de() { return this._de.word }
	get hl() { return this._hl.word }
	get pc() { return this._pc.word }
	get sp() { return this._sp.word }
	get ix() { return this._ix.word }
  get iy() { return this._iy.word }
	
	set af(val) { this._af.word = val }
	set bc(val) { this._bc.word = val }
	set de(val) { this._de.word = val }
	set hl(val) { this._hl.word = val }
	set pc(val) { this._pc.word = val }
	set sp(val) { this._sp.word = val }
	set ix(val) { this._ix.word = val }
	set iy(val) { this._iy.word = val }

  // Shadow 16-bit registers.
  
	get af_() { return this._af_.word }
	get bc_() { return this._bc_.word }
	get de_() { return this._de_.word }
	get hl_() { return this._hl_.word }
	
	set af_(val) { this._af_.word = val }
	set bc_(val) { this._bc_.word = val }
	set de_(val) { this._de_.word = val }
  set hl_(val) { this._hl_.word = val }
  
  // Flags.

  // S (Bit 7) == Sign, copy of bit 7 of result
  // Z (Bit 6) == Zero, 1 if result is zero
  // Y (Bit 5) == Copy of bit 5 of result
  // H (Bit 4) == Half-carry in add/sub, between bits 3 and 4
  // X (Bit 3) == Copy of bit 3 of result
  // P (Bit 2) == Parity, 1 if even number of bits are 1
  // V (Bit 2) == Overflow, 1 if result can't fit in signed integer
  // N (Bit 1) == 1 if last operation was subtraction
  // C (Bit 0) == Carry

  get flagS() { return (this.f >> 7) & 1 }
  get flagZ() { return (this.f >> 6) & 1 }
  get flagY() { return (this.f >> 5) & 1 }
  get flagH() { return (this.f >> 4) & 1 }
  get flagX() { return (this.f >> 3) & 1 }
  get flagP() { return (this.f >> 2) & 1 }
  get flagV() { return (this.f >> 2) & 1 }
  get flagN() { return (this.f >> 1) & 1 }
  get flagC() { return (this.f >> 0) & 1 }

  set flagS(val) { this.f = (this.f & ~(1 << 7)) | ((val & 1) << 7) }
  set flagZ(val) { this.f = (this.f & ~(1 << 6)) | ((val & 1) << 6) }
  set flagY(val) { this.f = (this.f & ~(1 << 5)) | ((val & 1) << 5) }
  set flagH(val) { this.f = (this.f & ~(1 << 4)) | ((val & 1) << 4) }
  set flagX(val) { this.f = (this.f & ~(1 << 3)) | ((val & 1) << 3) }
  set flagP(val) { this.f = (this.f & ~(1 << 2)) | ((val & 1) << 2) }
  set flagV(val) { this.f = (this.f & ~(1 << 2)) | ((val & 1) << 2) }
  set flagN(val) { this.f = (this.f & ~(1 << 1)) | ((val & 1) << 1) }
  set flagC(val) { this.f = (this.f & ~(1 << 0)) | ((val & 1) << 0) }
}

class Z80Golf {
	constructor() {
    this.memory = Array(65536)
    this.chip = new Z80Chip()
		this.running = false
  }
  
	init(code = [], stdin = []) {
		this.memory.fill(0)
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
