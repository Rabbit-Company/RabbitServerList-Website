import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';
import ColorThief from 'colorthief';

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
		let keywordsHTML = "";
		for(let j = 0; j < keywords.length; j++){
			if(j >= 5) break;
			keywordsHTML += "<a href='discord.html?q=" + keywords[j] + "'><span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + keywords[j] + "</span></a>";
		}

		data += `<li id="discord-server-${servers[i].id}" class="secondaryBackgroundColor col-span-1 flex flex-col divide-y passwordsBorderColor rounded-lg text-center shadow bg-no-repeat bg-center bg-cover">
		<div class="flex flex-1 flex-col p-8 bg-gradient-to-t from-[#161b22] via-[#1e252e]">
			<img id="discord-server-${servers[i].id}-logo" crossorigin="anonymous" class="bg-gradient-to-b from-[#161b22] to-[#28313e] border tertiaryBorderColor mx-auto w-[96px] h-[96px] flex-shrink-0 rounded-full" width="96" height="96" src="https://cdn.discordapp.com/icons/${servers[i].guild_id}/${servers[i].icon}" alt="${servers[i].name}">
			<h3 class="mt-6 text-sm font-medium tertiaryColor">${servers[i].name}</h3>
			<dl class="mt-1 flex flex-grow flex-col justify-between">
				<dd class="mt-3">
					<span class="inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium greenBadge">
						<svg class="h-4 w-4" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
							<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
						</svg>
						${servers[i].members} / ${servers[i].members_total}
					</span>
				</dd>
				<dd>
					${keywordsHTML}
				</dd>
			</dl>
		</div>
		<div class="secondaryBackgroundColor rounded-b-lg">
			<div class="-mt-px flex">
				<div class="flex w-0 flex-1">
					<a href="editor.html?type=discord&id=${servers[i].id}" class="tertiaryColor passwordsBorderColor relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border-t border-r border-transparent py-4 text-sm font-semibold">
						<svg class="h-6 w-6" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>
							<path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>
							<path d="M16 5l3 3"></path>
						</svg>
						EDIT
					</a>
				</div>
				<div class="-ml-px flex w-0 flex-1">
					<a id="discord-delete-${servers[i].id}" class="cursor-pointer tertiaryColor passwordsBorderColor relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border-t border-transparent py-4 text-sm font-semibold">
						<svg class="h-6 w-6" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M4 7l16 0"></path>
							<path d="M10 11l0 6"></path>
							<path d="M14 11l0 6"></path>
							<path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12"></path>
							<path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3"></path>
						</svg>
						DELETE
					</a>
				</div>
			</div>
		</div>
	</li>`;
	}

	document.getElementById("discord_table_data").innerHTML = data;

	const colorThief = new ColorThief();
	for(let i = 0; i < servers.length; i++){

		if(servers[i].banner !== null){
			document.getElementById('discord-server-' + servers[i].id).style = `background-image: url('https://cdn.discordapp.com/banners/${servers[i].guild_id}/${servers[i].banner}');`;
		}

		document.getElementById('discord-delete-' + servers[i].id).addEventListener('click', () => {
			Utils.changeDialog(7, { type: 'discord', id: servers[i].id });
			Utils.show('dialog');
		});

		let img = document.getElementById('discord-server-' + servers[i].id + '-logo');
		if(img.complete){
			let colors = colorThief.getColor(img);
			let hex = Utils.rgbToHex(colors[0],colors[1], colors[2]);

			img.style = `border-color: ${hex} !important;`;
		}else{
			img.addEventListener('load', () => {
				let colors = colorThief.getColor(img);
				let hex = Utils.rgbToHex(colors[0],colors[1], colors[2]);

				img.style = `border-color: ${hex} !important;`;
			});
		}
	}
}