import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';

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

if(localStorage.getItem('my-servers-discord') === null){
	fetchMyDiscordServers();
}else{
	renderMyDiscordServers();
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

function fetchMyDiscordServers(){
	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
	headers.set('Content-Type', 'application/json');

	fetch('https://api.rabbitserverlist.com/v1/account/servers/discord', {
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
		localStorage.setItem('my-servers-discord', JSON.stringify(response.data));
		renderMyDiscordServers();
	}).catch(() => {
		Utils.changeDialog(1, Errors.get(1009));
		Utils.show('dialog');
	});
}

function renderMyMinecraftServers(){
	let data = "";
	let servers = JSON.parse(localStorage.getItem('my-servers-minecraft'));

	for(let i = 0; i < servers.length; i++){
		let ip = (servers[i].port !== 25565) ? servers[i].ip + ':' + servers[i].port : servers[i].ip;
		let online = (servers[i].online === servers[i].updated) ? "Online" : "Offline";
		let online_color = (servers[i].online === servers[i].updated) ? "greenBadge" : "redBadge";
		let categories = servers[i].categories.split(',');

		data += "<tr class='passwordsBorderColor'>";
		data += "<td class='px-4 py-4 whitespace-nowarp hidden xl:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + servers[i].id + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 hidden 2xl:table-cell'><a href='/?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += `<td class='sm:w-[500px] text-center px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
			<div class='hidden sm:block'>
				<a id='minecraft-banner-${servers[i].id}' class='cursor-pointer'>
					<img class='rounded-t-md w-[468px] h-[60px]' width="468" height="60" src='https://api.rabbitserverlist.com/v1/server/minecraft/${servers[i].id}/banner' alt='${servers[i].name}' />
				</a>
				<span class='w-full inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium ${online_color}'>
					<span class='copyText cursor-pointer'>${ip}</span>
				</span>
			</div>
			<div class='sm:hidden'>
				<a href='/?server=${servers[i].id}'>
					<img class='rounded-md m-auto h-[60px]' width="468" height="60" src='https://api.rabbitserverlist.com/v1/server/minecraft/${servers[i].id}/banner' alt='${servers[i].name}' />
				</a>

				<span class='mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${online_color}'>${online}</span>
				<a href='/?version=${servers[i].version}'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${servers[i].version}</span></a>
				<span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${servers[i].players} / ${servers[i].players_max}</span>
				<br>
				<span class='mt-2 w-full max-w-[468px] inline-flex items-center justify-center px-2.5 py-0.5 text-sm rounded-md font-medium ${online_color}'>
					<span class='copyText cursor-pointer'>${ip}</span>
				</span>
			</div>
		</td>`;
		data += "<td class='px-4 py-4 hidden lg:table-cell'><div>";
		for(let j = 0; j < categories.length; j++){
			if(j >= 5) break;
			data += "<a href='/?category=" + categories[j] + "'><span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + categories[j] + "</span></a>";
		}
		data += "</div></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap hidden sm:table-cell'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden md:table-cell'><a href='editor.html?type=minecraft&id=" + servers[i].id + "' class='primaryButton px-3 py-2 rounded-md text-sm font-medium'>Edit</a></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden xl:table-cell'><span id='minecraft-delete-" + servers[i].id + "' class='dangerButton cursor-pointer px-3 py-2 rounded-md text-sm font-medium'>Delete</span></td>";
		data += "<input id='minecraft-uploadBanner-" + servers[i].id + "' type='file' accept='image/gif, image/png, image/jpeg' class='hidden'";
		data += "</tr>";
	}

	document.getElementById("minecraft_table_data").innerHTML = data;

	let copyElements = document.getElementsByClassName('copyText');
	for(let i = 0; i < copyElements.length; i++){
		copyElements[i].addEventListener('mouseover', () => {
			let text = copyElements[i].innerText.replace(' (click to copy)', '');
			copyElements[i].innerText = text + ' (click to copy)';
		});

		copyElements[i].addEventListener('mouseout', () => {
			let text = copyElements[i].innerText.replace(' (click to copy)', '');
			copyElements[i].innerText = text;
		});

		copyElements[i].addEventListener('click', () => {
			let text = copyElements[i].innerText.replace(' (click to copy)', '');
			if(text === 'Copied!') return;
			Utils.copyToClipboard(text);
			copyElements[i].innerText = "Copied!";
			window.setTimeout(() => {
				copyElements[i].innerText = text;
			}, 1000);
		});
	}

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

			if(!Validate.bannerType(file.type)){
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

function renderMyDiscordServers(){
	let data = "";
	let servers = JSON.parse(localStorage.getItem('my-servers-discord'));

	for(let i = 0; i < servers.length; i++){
		let keywords = servers[i].keywords.split(',');

		data += "<tr class='passwordsBorderColor'>";
		data += "<td class='px-4 py-4 whitespace-nowarp hidden xl:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium greenBadge'>" + servers[i].id + "</span></td>";
		data += `<td class='sm:w-[96px] text-center px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
			<div class='hidden sm:block'>
				<a id='minecraft-banner-${servers[i].id}' class='cursor-pointer'>
					<img class='rounded-full primaryBackgroundColor w-[96px]' width="96" height="96" src='https://cdn.discordapp.com/icons/${servers[i].guild_id}/${servers[i].icon}' alt='${servers[i].name}' />
				</a>
			</div>
			<div class='sm:hidden'>
				<a href='discord.html?server=${servers[i].id}'>
					<img class='rounded-full primaryBackgroundColor m-auto w-[96px]' width="96" height="96" src='https://cdn.discordapp.com/icons/${servers[i].guild_id}/${servers[i].icon}' alt='${servers[i].name}' />
				</a>

				<h2 class='tertiaryColor mt-2 text-lg'>${servers[i].name}</h2>

				<span class='mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium greenBadge'>${servers[i].members}</span>
				<a href='discord.html?version=${keywords[0]}'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium grayBadge'>${servers[i].category}</span></a>
				<span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${servers[i].members_total}</span>
				<br>
				<span class='mt-2 w-full max-w-[468px] inline-flex items-center justify-center px-2.5 py-0.5 text-sm rounded-md font-medium greenBadge'>
					<span class='copyText cursor-pointer'>https://discord.gg/${servers[i].invite_code}</span>
				</span>
			</div>
		</td>`;
		data += "<td class='tertiaryColor px-4 py-4 hidden sm:table-cell'><a href='discord.html?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += "<td class='tertiaryColor px-4 py-4 whitespace-nowrap hidden sm:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium grayBadge'>" + servers[i].category + "</span></td>";
		data += "<td class='px-4 py-4 hidden lg:table-cell'><div>";
		for(let j = 0; j < keywords.length; j++){
			if(j >= 10) break;
			data += "<a href='discord.html?category=" + keywords[j] + "'><span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + keywords[j] + "</span></a>";
		}
		data += "</div></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap hidden sm:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium greenBadge'>" + servers[i].members + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 whitespace-nowrap hidden sm:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>" + servers[i].members_total + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden md:table-cell'><a href='editor.html?type=discord&id=" + servers[i].id + "' class='primaryButton px-3 py-2 rounded-md text-sm font-medium'>Edit</a></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden xl:table-cell'><span id='discord-delete-" + servers[i].id + "' class='dangerButton cursor-pointer px-3 py-2 rounded-md text-sm font-medium'>Delete</span></td>";
		data += "</tr>";
	}

	document.getElementById("discord_table_data").innerHTML = data;

	for(let i = 0; i < servers.length; i++){
		document.getElementById('discord-delete-' + servers[i].id).addEventListener('click', () => {
			Utils.changeDialog(7, { type: 'discord', id: servers[i].id });
			Utils.show('dialog');
		});
	}
}