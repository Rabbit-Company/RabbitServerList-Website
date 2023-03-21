//Remove old data
let keys = Object.keys(localStorage);
for(let i = 0; i < keys.length; i++){
	let time = localStorage.getItem(keys[i] + '-time');
	if(time !== null && Number(time) + 1_800_000 < Date.now()){
		localStorage.removeItem(keys[i]);
		localStorage.removeItem(keys[i] + '-time');
	}
}

async function fetchServer(type, id){
	await fetch("https://api.rabbitserverlist.com/v1/server/" + type + "/" + id).then((response) => response.json()).then((data) => {
		localStorage.setItem('server-' + type + '-' + id, JSON.stringify(data.data));
		localStorage.setItem('server-' + type + '-' + id + '-time', Date.now());
	}).catch(() => {
		localStorage.setItem('server-' + type + '-' + id, "{}");
		localStorage.setItem('server-' + type + '-' + id + '-time', 0);
	});
}

async function fetchServers(type, page){
	await fetch("https://api.rabbitserverlist.com/v1/servers/" + type + "/" + page).then((response) => response.json()).then((data) => {
		localStorage.setItem('servers-' + type + '-' + page, JSON.stringify(data.data));
		localStorage.setItem('servers-' + type + '-' + page + '-time', Date.now());
	}).catch(() => {
		localStorage.setItem('servers-' + type + '-' + page, "[]");
		localStorage.setItem('servers-' + type + '-' + page + '-time', 0);
	});
}

function isPositiveInteger(s) {
	return /^\+?[1-9][\d]*$/.test(s);
}

function toggleMenu(){
	if(document.getElementById("mobile-menu").className == 'hidden pt-2 pb-3 space-y-1'){
		document.getElementById("mobile-menu").className = 'pt-2 pb-3 space-y-1';
	}else{
		document.getElementById("mobile-menu").className = 'hidden pt-2 pb-3 space-y-1';
	}
}