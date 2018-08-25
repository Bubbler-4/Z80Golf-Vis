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

	get af() { return this._af.word }
	get bc() { return this._bc.word }
	get de() { return this._de.word }
	get hl() { return this._hl.word }
	get pc() { return this._pc.word }
	get sp() { return this._sp.word }
	get ix() { return this._ix.word }
	get iy() { return this._iy.word }

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
	
	set af(val) { this._af.word = val }
	set bc(val) { this._bc.word = val }
	set de(val) { this._de.word = val }
	set hl(val) { this._hl.word = val }
	set pc(val) { this._pc.word = val }
	set sp(val) { this._sp.word = val }
	set ix(val) { this._ix.word = val }
	set iy(val) { this._iy.word = val }
}

class Z80Golf {
	constructor() {
		this.memory = Array(65536)
		this.running = false
	}
	init(code = [], stdin = []) {
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
