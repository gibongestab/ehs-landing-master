const HORAS_DIA = 5.6;
const VH_FACTOR = 1.9;
const VA_FACTOR = 1.9;
const VT_FACTOR = 1.9;
const PERDA_DE_PRODUTIVIDADE_VT_MINUTOS = 5;

Template.calculator.onCreated(function() {
	
	let f = 1;
	let iDiasTrabalhados = 30 * f;
	let iVh = 1500 * f;
	let iVa = 1500 * f;
	let iVt = 2900 * f;
	let iTo = 30 * f;
	let iVp = 27 * f;
	let iN = 45 * f;
	let iTm = 10 * f;
	let iTa = 30 * f;

	this.diasTrabalhados = new ReactiveVar(iDiasTrabalhados);
	this.vh = new ReactiveVar(iVh);
	this.va = new ReactiveVar(iVa);
	this.vt = new ReactiveVar(iVt);
	this.to = new ReactiveVar(iTo);
	this.vp = new ReactiveVar(iVp);
	this.n = new ReactiveVar(iN);
	this.tm = new ReactiveVar(iTm);
	this.ta = new ReactiveVar(iTa);


	this.horasTrabalhadas = new ReactiveVar(0);

	this.valorPorHoraVH = new ReactiveVar(0);
	this.perdaDeProdutividadeVH = new ReactiveVar(0);

	this.valorPorHoraVA = new ReactiveVar(0);
	this.perdaDeProdutividadeVA = new ReactiveVar(0)

	this.valorPorHoraVT = new ReactiveVar(0);
	this.perdaDeProdutividadeVT = new ReactiveVar(0);

	this.perdaDeProdutividadeVP = new ReactiveVar(0);

	this.perdaDeProdutividadeTA = new ReactiveVar(0)

	this.economia = new ReactiveVar(0);

	this.economiaPorRetirada = new ReactiveVar(0);

	this.autorun(() => {
		this.horasTrabalhadas.set(this.diasTrabalhados.get() * HORAS_DIA);
	})

	this.autorun(() => {
		this.valorPorHoraVH.set(this.vh.get() * VH_FACTOR / this.horasTrabalhadas.get());
	})

	this.autorun(() => {
		this.perdaDeProdutividadeVH.set(this.diasTrabalhados.get() * (this.n.get() * ((this.to.get() / 60) * this.valorPorHoraVH.get())));	
	})

	this.autorun(() => {
		this.valorPorHoraVA.set(this.va.get() * VA_FACTOR / this.horasTrabalhadas.get());
	})

	this.autorun(() => {
		this.perdaDeProdutividadeVA.set(this.diasTrabalhados.get() * (this.n.get() * ((this.tm.get() / 60) * this.valorPorHoraVA.get())));	
	})

	this.autorun(() => {
		this.valorPorHoraVT.set(this.vt.get() * VT_FACTOR / this.horasTrabalhadas.get());
	})

	this.autorun(() => {
		this.perdaDeProdutividadeVT.set(this.diasTrabalhados.get() * (this.n.get() * ((PERDA_DE_PRODUTIVIDADE_VT_MINUTOS / 60) * this.valorPorHoraVT.get())));	
	})	

	this.autorun(() => {
		this.perdaDeProdutividadeVP.set(this.diasTrabalhados.get() * (this.n.get() * ((this.to.get() / 60) * this.vp.get())));	
	})

	this.autorun(() => {
		this.perdaDeProdutividadeTA.set((this.ta.get()/60) * (150/this.n.get()) * this.diasTrabalhados.get() * this.valorPorHoraVA.get());
	})

	this.autorun(() => {
		this.economia.set(this.perdaDeProdutividadeVH.get() + this.perdaDeProdutividadeVA.get() + this.perdaDeProdutividadeVT.get() + this.perdaDeProdutividadeVP.get() - this.perdaDeProdutividadeTA.get());
	})

	this.autorun(() => {
		this.economiaPorRetirada.set(this.economia.get() / (this.n.get() * this.diasTrabalhados.get()))
	})
});

function formatTime(x) {
	let hours = Math.floor(x);
	let minutes = Math.floor((x - Math.floor(x)) * 60)

	if (!x) {
		return '0h';
	}
	if (!minutes) {
		return hours + 'h';
	} else {
		return hours + 'h e ' + minutes + 'm';
	}
}
function format(x) {
	return x.toFixed(2);
}

function formatReais(x) {
	return accounting.formatMoney(x, "R$ ", 2, ".", ","); // R$ 4.999,99
}
Template.calculator.helpers({
	horasTrabalhadas() {
		return formatTime(Template.instance().horasTrabalhadas.get());
	},
	valorPorHoraVH() {
		return formatReais(Template.instance().valorPorHoraVH.get());
	},
	perdaDeProdutividadeVH() {
		return formatReais(Template.instance().perdaDeProdutividadeVH.get());
	},
	valorPorHoraVA() {
		return formatReais(Template.instance().valorPorHoraVA.get());
	},
	perdaDeProdutividadeVA() {
		return formatReais(Template.instance().perdaDeProdutividadeVA.get());
	},
	valorPorHoraVT() {
		return formatReais(Template.instance().valorPorHoraVT.get());
	},
	perdaDeProdutividadeVT() {
		return formatReais(Template.instance().perdaDeProdutividadeVT.get());
	},
	perdaDeProdutividadeVP() {
		return formatReais(Template.instance().perdaDeProdutividadeVP.get());
	},
	perdaDeProdutividadeTA() {
		return formatReais(Template.instance().perdaDeProdutividadeTA.get());	
	},
	economia() {
		return formatReais(Template.instance().economia.get());
	},
	economiaPorRetirada() {
		return formatReais(Template.instance().economiaPorRetirada.get());	
	},
})

function unmask(el) {
	return $(el).maskMoney('unmasked')[0];
}
Template.calculator.events({
	'input #dias-trabalhados': function(e, t) {
		let el = $(e.target);
		let input = $(el).val();
		t.diasTrabalhados.set(input);
	},	
	'keyup #vh': function(e, t) {
		let el = $(e.target);
		let input = unmask(el);
		t.vh.set(input);	
	},
	'keyup #va': function(e, t) {
		let el = $(e.target);
		let input = unmask(el);
		t.va.set(input);
	},
	'keyup #vt': function(e, t) {
		let el = $(e.target);
		let input = unmask(el)
		t.vt.set(input);
	},
	'input #to': function(e, t) {
		let el = $(e.target);
		let input = $(el).val();
		t.to.set(input);
	},
	'keyup #vp': function(e, t) {
		let el = $(e.target);
		let input = unmask(el);
		t.vp.set(input);
	},		
	'input #n': function(e, t) {
		let el = $(e.target);
		let input = $(el).val();
		t.n.set(input);
	},			
	'input #tm': function(e, t) {
		let el = $(e.target);
		let input = $(el).val();
		t.tm.set(input);
	},	
	'input #ta': function(e, t) {
		let el = $(e.target);
		let input = $(el).val();
		t.ta.set(input);
	},	
})

Template.calculator.onRendered(function() {
	let options = {
		prefix: 'R$ ',
		thousands: '.',
		decimal: ',',
		affixesStay: true		
	}
	$('#vh').maskMoney(options).maskMoney('mask', this.vh.get());
	$('#va').maskMoney(options).maskMoney('mask', this.va.get());
	$('#vt').maskMoney(options).maskMoney('mask', this.vt.get());
	$('#vp').maskMoney(options).maskMoney('mask', this.vp.get());
	$('#dias-trabalhados').val(this.diasTrabalhados.get());
	$('#to').val(this.to.get());
	$('#n').val(this.n.get());
	$('#tm').val(this.tm.get());
	$('#ta').val(this.ta.get());

})