const $movements_list = document.querySelector(".movement-list > .list");
const $movements_tpl = document.querySelector("#movements-list-item");
const $people_add = document.querySelector("[name=person-add]");
const $people_tpl = document.querySelector("#person-list-item");
const $people_list = document.querySelector(".people-list > .list");
$people_list.addEventListener("click", function(e){
	if( e.target.name === "person-delete" ){
		e.target.closest(".list-item").remove();
		const payments = [...$people_list.querySelectorAll(".person")].map( p => ({ name: p.querySelector("[name=name]").value, amnt: parseFloat(p.querySelector("[name=amnt]").value) }) );
		showMovements(payments);
	}
});
$people_list.addEventListener("input", function(e){
	const payments = [...$people_list.querySelectorAll(".person")].map( p => ({ name: p.querySelector("[name=name]").value, amnt: parseFloat(p.querySelector("[name=amnt]").value) }) );
	showMovements(payments);
});
$people_list.addEventListener("keyup", function(e){
	if( e.keyCode == 13 ){
		$all = [...$people_list.querySelectorAll("input")];
		curr_index = $all.findIndex( n => n == e.target );
		if( curr_index > -1 && curr_index < $all.length - 1 ){
			$all[ curr_index + 1 ].select();
		}else{
			$people_add.click();
		}
	}
});
$people_add.addEventListener("click", function(e){
	$people_list.appendChild( $people_tpl.content.cloneNode(true) );
	$all = $people_list.querySelectorAll("[name=name]");
	if( $all.length ){
		$all[ $all.length - 1 ].select();
	}

	const payments = [...$people_list.querySelectorAll(".person")].map( p => ({ name: p.querySelector("[name=name]").value, amnt: parseFloat(p.querySelector("[name=amnt]").value) }) );
	showMovements(payments);
})

function showMovements(payments){
	$movements_list.innerHTML = "";
	getMovements(payments).map( p => {
		$node = $movements_tpl.content.cloneNode(true);
		$node.querySelector(".from").innerText = p.from;
		$node.querySelector(".to").innerText = p.to;
		$node.querySelector(".amnt").innerText = `$ ${p.value}`;

		return $node;
	}).forEach( tx => { $movements_list.appendChild(tx) } );
}

const EXP = 100*100;
function getMovements(payments){
	payments = payments.map( ({name,amnt}) => ({name, amnt: Math.trunc(amnt*EXP)}) );
	const PerPerson = Math.trunc(payments.map( tx => tx.amnt ).reduce((prev,curr) => prev+curr, 0) / payments.length);

	const Transactions = payments.map( ({name, amnt}) => ({name, amnt: amnt - PerPerson}) )
	const Creds = Transactions.filter(t => t.amnt > 0).sort( (a,z) => a.amnt - z.amnt)
	const Debs = Transactions.filter( t => t.amnt < 0 ).sort( (a,z) => z.amnt - a.amnt)

	const Movements = [];
	while (Debs.length){
		const to = Creds[0];
		const from = Debs[0];
		const value = Math.min(to.amnt, Math.abs(from.amnt))

		to.amnt = to.amnt - value;
		from.amnt = from.amnt + value;
		Movements.push({ from: from.name, to: to.name, value: (value/EXP).toFixed(2) });
		if( to.amnt == 0 ){
			Creds.shift();
		}
		if( from.amnt == 0 ){
			Debs.shift();
		}
	}

	return Movements
}

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register("sw.js", { scope: "/splitto/" });
}
