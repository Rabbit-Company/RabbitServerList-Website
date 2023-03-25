import Utils from './utils.js';
import Errors from './errors.js';

Utils.initialize();
Utils.requireAuthentication();

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
	Utils.toggleMenu();
});

try{
	document.getElementById('logout').addEventListener('click', () => {
		Utils.logout();
	});
}catch{}

if(localStorage.getItem('my-servers-minecraft') === null){
	fetchMyMinecraftServers();
}else{
	renderMyMinecraftServers();
}

function fetchMyMinecraftServers(){
	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
	headers.set('Content-Type', 'application/json');

	fetch('https://api.rabbitserverlist.com/v1/account/servers/minecraft', {
		method: 'GET',
		headers: headers,
	}).then(result => {
		return result.json();
	}).then(response => {
		if(response.error !== 0){
			Utils.changeDialog(1, response.info);
			Utils.show('dialog');
			return;
		}
		localStorage.setItem('my-servers-minecraft', JSON.stringify(response.data));
		renderMyMinecraftServers();
	}).catch(() => {
		Utils.changeDialog(1, Errors.get(1009));
		Utils.show('dialog');
	});
}

function renderMyMinecraftServers(){
	let data = "";
	let servers = JSON.parse(localStorage.getItem('my-servers-minecraft'));

	for(let i = 0; i < servers.length; i++){
		let online = (servers[i].online) ? "Online" : "Offline";
		let online_color = (servers[i].online) ? "greenBadge" : "redBadge";
		let categories = servers[i].categories.split(',');

		data += "<tr>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + servers[i].id + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 whitespace-nowrap'><a href='?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += "<td class='text-center px-4 py-4 whitespace-nowrap text-sm text-gray-500'><a id='minecraft-banner-" + servers[i].id + "' class='cursor-pointer'><img class='rounded-t-md w-full' src='https://api.rabbitserverlist.com/v1/server/minecraft/" + servers[i].id + "/banner' /></a><span class='w-full inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium " + online_color + "'><a href='#'>" + servers[i].ip + "</a></span></td>";
		data += "<td class='px-4 py-4'><div>";
		for(let j = 0; j < categories.length; j++) data += "<span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + categories[j] + "</span>";
		data += "</div></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>" + servers[i].version + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + online + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><a href='editor.html?type=minecraft&id=" + servers[i].id + "' class='primaryButton px-3 py-2 rounded-md text-sm font-medium'>Edit</a>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><a id='minecraft-delete-" + servers[i].id + "' class='dangerButton cursor-pointer px-3 py-2 rounded-md text-sm font-medium'>Delete</a>";
		data += "<input id='minecraft-uploadBanner-" + servers[i].id + "' type='file' accept='image/gif' class='hidden'";
		data += "</tr>";
	}

	document.getElementById("minecraft_table_data").innerHTML = data;

	for(let i = 0; i < servers.length; i++){

		document.getElementById('minecraft-delete-' + servers[i].id).addEventListener('click', () => {
			Utils.changeDialog(7, { type: 'minecraft', id: servers[i].id });
			Utils.show('dialog');
		});

		document.getElementById('minecraft-banner-' + servers[i].id).addEventListener('click', () => {
			document.getElementById('minecraft-uploadBanner-' + servers[i].id).click();
		});

		document.getElementById('minecraft-uploadBanner-' + servers[i].id).addEventListener('input', () => {
			let fileInput = document.getElementById('minecraft-uploadBanner-' + servers[i].id);
			let file = fileInput.files[0];

			if(file.type !== 'image/gif'){
				fileInput.value = "";
				Utils.changeDialog(1, Errors.get(1024));
				Utils.show('dialog');
				return;
			}

			if(file.size > 3_000_000){
				fileInput.value = "";
				Utils.changeDialog(1, Errors.get(1025));
				Utils.show('dialog');
				return;
			}

			Utils.changeDialog(2, 'Uploading banner...');
			Utils.show('dialog');

			let headers = new Headers();
			headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
			headers.set('Content-Type', 'image/gif');

			fetch('https://api.rabbitserverlist.com/v1/server/minecraft/' + servers[i].id + '/banner', {
				method: 'PUT',
				headers: headers,
				body: file
			}).then(result => {
				return result.json();
			}).then(response => {
				if(response.error !== 0){
					Utils.changeDialog(1, response.info);
					Utils.show('dialog');
					return;
				}

				Utils.changeDialog(5, 'Banner has been updated.');
				Utils.show('dialog');
			}).catch(() => {
				Utils.changeDialog(1, Errors.get(1009));
				Utils.show('dialog');
			});

		});
	}
}