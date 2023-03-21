export function clearOldData(){
	let keys = Object.keys(localStorage);
	for(let i = 0; i < keys.length; i++){
		let time = localStorage.getItem(keys[i] + '-time');
		if(time !== null && Number(time) + 1_800_000 < Date.now()){
			localStorage.removeItem(keys[i]);
			localStorage.removeItem(keys[i] + '-time');
		}
	}
}

export async function fetchServer(type, id){
	let req = await fetch("https://api.rabbitserverlist.com/v1/server/" + type + "/" + id);
	let data = await req.json();

	localStorage.setItem('server-minecraft-' + id, JSON.stringify(data.data));
	localStorage.setItem('server-minecraft-' + id + '-time', Date.now());

	return data.data;
}

export async function fetchServers(type, page){
	let req = await fetch("https://api.rabbitserverlist.com/v1/servers/" + type + "/" + page);
	let data = await req.json();

	localStorage.setItem('servers-minecraft-' + page, JSON.stringify(data.data));
	localStorage.setItem('servers-minecraft-' + page + '-time', Date.now());

	return data.data;
}

export function isPositiveInteger(s) {
	return /^\+?[1-9][\d]*$/.test(s);
}

export function toggleMenu(){
	if(document.getElementById("mobile-menu").className == 'hidden pt-2 pb-3 space-y-1'){
		document.getElementById("mobile-menu").className = 'pt-2 pb-3 space-y-1';
	}else{
		document.getElementById("mobile-menu").className = 'hidden pt-2 pb-3 space-y-1';
	}
}