let reim;
let url;
let contador = 0;
let contador_global = 0;
let length = 0;
let w = 600;
let h = 600;
let list = [];
let i;
let size = 10;
let escala = 10;
let limite = 1000;
let soma = 0;


function setup() {
	//Thank you Jarbas
	url = 'https://jarbas.serenata.ai/api/chamber_of_deputies/reimbursement/';
	createCanvas(1000, 1400);
	for (i = 0; i <= limite; i++) {
		list[i] = 0;
	}

}

function gotData(data) {
	reim = data;
}

function draw() {
	background(200);
	loadJSON(url, gotData);
	if (reim) {
		url = reim.next;
		length = reim.results.length;
		while (contador < length - 1) {
			console.log("Contador global: : ");
			console.log(contador_global);
			console.log("Value: ");
			console.log(reim.results[contador].total_net_value);
			contador++;
			contador_global++;
			console.log("Index:");
			console.log(Math.trunc(reim.results[contador].total_net_value));
			list[Math.trunc(reim.results[contador].total_net_value)]++;
		}
		contador = 0;
		for (i = 0; i <= limite; i++) {
			if (i % escala == 0) {
				rect(i * size / escala, 0, size, soma);
				if (soma != 0) {
					fill(0);
					text(i, i * size / escala, soma + size);
				}
				soma = 0;
			}
			soma += list[i];
			fill(255);
		}
	}
}
