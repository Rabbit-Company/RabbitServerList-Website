import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

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

document.getElementById("tabs-1-tab-1").addEventListener("click", () => {
	Utils.hide("tabs-1-panel-2");
	Utils.show("tabs-1-panel-1", "block");
});

document.getElementById("tabs-1-tab-2").addEventListener("click", () => {
	Utils.hide("tabs-1-panel-1");

	let description = document.getElementById("description").value;
	let html = marked.parse(description, {
		gfm: true,
		breaks: true,
		sanitizer: DOMPurify.sanitize
	});
	document.getElementById('preview').innerHTML = html;

	Utils.show("tabs-1-panel-2", "block");
});

const parms = new URLSearchParams(window.location.search);

let type = parms.get('type');
if(type === null || !['minecraft', 'discord'].includes(type)) location.href = "panel.html";

let id = (parms.get('id') !== null && Utils.isPositiveInteger(parms.get('id'))) ? parms.get('id') : null;
let editData = {};
if(id !== null){
	let servers = JSON.parse(localStorage.getItem('my-servers-' + type));
	for(let i = 0; i < servers.length; i++){
		if(servers[i].id === Number(id)){
			editData = servers[i];
			break;
		}
	}
}

let serverData = {
	'minecraft': {
		'title1': 'Minecraft Server',
		'desc1': '',
		'inputs': {
			'server_name': {
				'type': 'text',
				'name': 'name',
				'placeholder': 'Server Name',
				'required': true,
				'validate': {
					'name': 'serverName',
					'errorCode': 1010
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_ip': {
				'type': 'text',
				'name': 'ip',
				'placeholder': 'IP',
				'required': true,
				'validate': {
					'name': 'ip',
					'errorCode': 1011
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='4' width='18' height='8' rx='3' /><rect x='3' y='12' width='18' height='8' rx='3' /><line x1='7' y1='8' x2='7' y2='8.01' /><line x1='7' y1='16' x2='7' y2='16.01' />"
			},
			'server_port': {
				'type': 'number',
				'name': 'port',
				'placeholder': 'Port',
				'required': true,
				'validate': {
					'name': 'port',
					'errorCode': 1012
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='4' width='18' height='8' rx='3' /><rect x='3' y='12' width='18' height='8' rx='3' /><line x1='7' y1='8' x2='7' y2='8.01' /><line x1='7' y1='16' x2='7' y2='16.01' />"
			},
			'server_bedrock_ip': {
				'type': 'text',
				'name': 'bedrock_ip',
				'placeholder': 'Bedrock IP (Optional)',
				'required': false,
				'validate': {
					'name': 'ip',
					'errorCode': 1030
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3' /><path d='M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3' /><circle cx='15' cy='9' r='1' />"
			},
			'server_bedrock_port': {
				'type': 'number',
				'name': 'bedrock_port',
				'placeholder': 'Bedrock Port (Optional)',
				'required': false,
				'validate': {
					'name': 'port',
					'errorCode': 1031
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3' /><path d='M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3' /><circle cx='15' cy='9' r='1' />"
			},
			'server_website': {
				'type': 'text',
				'name': 'website',
				'placeholder': 'Website (Optional)',
				'required': false,
				'validate': {
					'name': 'website',
					'errorCode': 1013
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><polyline points='5 12 3 12 12 3 21 12 19 12' /><path d='M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7' /><path d='M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6' />"
			},
			'server_discord': {
				'type': 'text',
				'name': 'discord',
				'placeholder': 'Discord (Optional)',
				'required': false,
				'validate': {
					'name': 'website',
					'errorCode': 1014
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='9' cy='12' r='1' /><circle cx='15' cy='12' r='1' /><path d='M7.5 7.5c3.5 -1 5.5 -1 9 0' /><path d='M7 16.5c3.5 1 6.5 1 10 0' /><path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5' /><path d='M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5' />"
			},
			'server_twitter': {
				'type': 'text',
				'name': 'twitter',
				'placeholder': 'Twitter (Optional)',
				'required': false,
				'validate': {
					'name': 'twitter',
					'errorCode': 1027
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z' />"
			},
			'server_store': {
				'type': 'text',
				'name': 'store',
				'placeholder': 'Store (Optional)',
				'required': false,
				'validate': {
					'name': 'website',
					'errorCode': 1028
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='6' cy='19' r='2' /><circle cx='17' cy='19' r='2' /><path d='M17 17h-11v-14h-2' /><path d='M6 5l14 1l-1 7h-13' />"
			},
			'server_trailer': {
				'type': 'text',
				'name': 'trailer',
				'placeholder': 'Trailer [Youtube Video] (Optional)',
				'required': false,
				'validate': {
					'name': 'youtubeVideo',
					'errorCode': 1029
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='5' width='18' height='14' rx='4' /><path d='M10 9l5 3l-5 3z' />"
			},
			'server_version': {
				'type': 'select',
				'name': 'version',
				'placeholder': 'Version',
				'options': Validate.minecraftServerVersionList,
				'required': true,
				'validate': {
					'name': 'minecraftServerVersion',
					'errorCode': 1015
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_country': {
				'type': 'select',
				'name': 'country',
				'placeholder': 'Country',
				'options': Validate.countryList,
				'required': true,
				'validate': {
					'name': 'country',
					'errorCode': 1017
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='12' cy='12' r='9' /><line x1='3.6' y1='9' x2='20.4' y2='9' /><line x1='3.6' y1='15' x2='20.4' y2='15' /><path d='M11.5 3a17 17 0 0 0 0 18' /><path d='M12.5 3a17 17 0 0 1 0 18' />"
			},
			'server_votifierIP': {
				'type': 'text',
				'name': 'votifier_ip',
				'placeholder': 'Votifier IP (Optional)',
				'required': false,
				'validate': {
					'name': 'ip',
					'errorCode': 1019
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='12' width='6' height='8' rx='1' /><rect x='9' y='8' width='6' height='12' rx='1' /><rect x='15' y='4' width='6' height='16' rx='1' /><line x1='4' y1='20' x2='18' y2='20' />"
			},
			'server_votifierPort': {
				'type': 'number',
				'name': 'votifier_port',
				'placeholder': 'Votifier Port (Optional)',
				'required': false,
				'validate': {
					'name': 'port',
					'errorCode': 1020
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='12' width='6' height='8' rx='1' /><rect x='9' y='8' width='6' height='12' rx='1' /><rect x='15' y='4' width='6' height='16' rx='1' /><line x1='4' y1='20' x2='18' y2='20' />"
			},
			'server_votifierToken': {
				'type': 'text',
				'name': 'votifier_token',
				'placeholder': 'Votifier Token (Optional)',
				'required': false,
				'validate': {
					'name': 'minecraftVotifierToken',
					'errorCode': 1021
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='8' cy='15' r='4' /><line x1='10.85' y1='12.15' x2='19' y2='4' /><line x1='18' y1='5' x2='20' y2='7' /><line x1='15' y1='8' x2='17' y2='10' />"
			}
		}
	},
	'discord': {
		'title1': 'Discord Server',
		'desc1': '',
		'inputs': {
			'server_invite_code': {
				'type': 'text',
				'name': 'invite_code',
				'placeholder': 'Discord Invite Link',
				'required': true,
				'validate': {
					'name': 'discordInviteCode',
					'errorCode': 1036
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='9' cy='12' r='1' /><circle cx='15' cy='12' r='1' /><path d='M7.5 7.5c3.5 -1 5.5 -1 9 0' /><path d='M7 16.5c3.5 1 6.5 1 10 0' /><path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5' /><path d='M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5' />"
			},
			'server_category': {
				'type': 'select',
				'name': 'category',
				'placeholder': 'Category',
				'options': Validate.discordServerCategoryList,
				'required': true,
				'validate': {
					'name': 'discordServerCategory',
					'errorCode': 1039
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><line x1='9' y1='6' x2='20' y2='6' /><line x1='9' y1='12' x2='20' y2='12' /><line x1='9' y1='18' x2='20' y2='18' /><line x1='5' y1='6' x2='5' y2='6.01' /><line x1='5' y1='12' x2='5' y2='12.01' /><line x1='5' y1='18' x2='5' y2='18.01' />"
			},
			'server_keywords': {
				'type': 'text',
				'name': 'keywords',
				'placeholder': 'Keywords',
				'required': true,
				'validate': {
					'name': 'keywords',
					'errorCode': 1038
				},
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M7.859 6h-2.834a2.025 2.025 0 0 0 -2.025 2.025v2.834c0 .537 .213 1.052 .593 1.432l6.116 6.116a2.025 2.025 0 0 0 2.864 0l2.834 -2.834a2.025 2.025 0 0 0 0 -2.864l-6.117 -6.116a2.025 2.025 0 0 0 -1.431 -.593z'></path><path d='M17.573 18.407l2.834 -2.834a2.025 2.025 0 0 0 0 -2.864l-7.117 -7.116'></path><path d='M6 9h-.01'></path>"
			}
		}
	}
}

document.getElementById('title-1').innerText = serverData[type].title1;
document.getElementById('desc-1').innerText = serverData[type].desc1;

if(id !== null){
	document.getElementById('btn-add').innerText = 'Save';
	document.getElementById('description').value = editData['description'];
}

let html = "";
let inputs = Object.keys(serverData[type].inputs);
for(let i = 0; i < inputs.length; i++){
	let data = serverData[type].inputs[inputs[i]];
	if(data.type === 'select'){

		let options = "";
		if(Array.isArray(data.options)){
			data.options.forEach(option => {
				let selected = '';
				if(option === editData[inputs[i].replace('server_', '')]) selected = 'selected';
				options += `<option ${selected}>${option}</option>`;
			});
		}else{
			let keys = Object.keys(data.options);
			for(let j = 0; j < keys.length; j++){
				let selected = '';
				if(keys[j] === editData[inputs[i].replace('server_', '')]) selected = 'selected';
				options += `<option value="${keys[j]}" ${selected}>${data.options[keys[j]]}</option>`;
			}
		}

		html += `
		<div>
			<label for="${data.name}" class="sr-only">${data.placeholder}</label>
			<div class="relative rounded-md shadow-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 secondaryColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						${data.icon}
					</svg>
				</div>
				<select id="${inputs[i]}" name="${data.name}" required="" class="tertiaryBackgroundColor tertiaryColor primaryBorderColor appearance-none rounded-none block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm">
					${options}
				</select>
			</div>
		</div>`;
	}else{
		let required = (data.required) ? 'required' : '';
		let evalue = editData[inputs[i].replace('server_', '')];
		if(evalue === null) evalue = '';
		let value = (id !== null) ? evalue : '';
		html += `
		<div>
			<label for="${data.name}" class="sr-only">Title</label>
			<div class="relative rounded-md shadow-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 secondaryColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						${data.icon}
					</svg>
				</div>
				<input id="${inputs[i]}" name="${data.name}" type="${data.type}" autocomplete="off" ${required} class="tertiaryBackgroundColor tertiaryColor primaryBorderColor appearance-none rounded-none block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm" placeholder="${data.placeholder}" value="${value}">
			</div>
		</div>`;
	}
}
document.getElementById('inputs').innerHTML = html;

html = "";
if(type === 'minecraft'){
	if(id === null){
		Validate.minecraftServerCategoryList.forEach(category => {
			html += `<input type='checkbox' name='categories' value='${category}'> ${category}</br>`;
		});
	}else{
		let checkedCategories = editData['categories'].split(',');
		Validate.minecraftServerCategoryList.forEach(category => {
			let checked = '';
			if(checkedCategories.includes(category)) checked = 'checked'
			html += `<input type='checkbox' name='categories' value='${category}' ${checked}> ${category}</br>`;
		});
	}
}else if(type === 'discord'){
	Utils.hide('categoriesSection');

	document.getElementById("server_keywords").addEventListener("input", () => {
		let keywords = document.getElementById("server_keywords").value;
		keywords = keywords.replaceAll(' ', ',');
		document.getElementById("server_keywords").value = keywords.toLowerCase();
	});
}
document.getElementById('categories').innerHTML = html;

function addServer(){

	Utils.changeDialog(2, 'Uploading server data...');
	Utils.show('dialog');

	let data = {};
	let keys = Object.keys(serverData[type].inputs);
	let error = false;
	for(let i = 0; i < keys.length; i++){
		let id = keys[i].replace('server_', '');
		let value = document.getElementById(keys[i]).value;
		data[id] = (value !== '') ? value : null;

		// Validate
		if(!Validate[serverData[type].inputs[keys[i]].validate?.name](data[id]) && serverData[type].inputs[keys[i]].required){
			Utils.changeDialog(1, Errors.get(serverData[type].inputs[keys[i]].validate?.errorCode));
			Utils.show('dialog');
			error = true;
			return;
		}
	}

	if(error) return;

	data['categories'] = [];
	let categoryInputs = document.getElementsByName('categories');
	for(let i = 0; i < categoryInputs.length; i++){
		if(!categoryInputs[i].checked) continue;
		data['categories'].push(categoryInputs[i].value);
	};

	if(type === 'discord'){
		data['keywords'] = document.getElementById('server_keywords').value.split(',');
		data['token'] = localStorage.getItem('discord-oauth-token');
		data['invite_code'] = data['invite_code'].replaceAll('https://discord.gg/', '');
	}

	data['description'] = document.getElementById('description').value;

	if(type === 'minecraft' && !Validate.minecraftServerCategory(data['categories'])){
		Utils.changeDialog(1, 'Please select between one to five categories.');
		Utils.show('dialog');
		return;
	}

	if(!Validate.description(data['description'])){
		Utils.changeDialog(1, 'Description needs to be between 150 and 10 000 characters long.');
		Utils.show('dialog');
		return;
	}

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
	headers.set('Content-Type', 'application/json');

	fetch('https://api.rabbitserverlist.com/v1/account/servers/' + type, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(data)
	}).then(result => {
		return result.json();
	}).then(response => {

		if(response.error === 1040){
			localStorage.setItem('lastPage', window.location.href);
			window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1093795826238758962&redirect_uri=https%3A%2F%2Frabbitserverlist.com%2Foauth&response_type=token&scope=identify%20guilds&state=" + localStorage.getItem('userToken');
			return;
		}

		if(response.error !== 0){
			Utils.changeDialog(1, response.info);
			Utils.show('dialog');
			return;
		}

		localStorage.removeItem('my-servers-' + type);
		Utils.changeDialog(8, 'Server added successfully!');
		Utils.show('dialog');
	}).catch(() => {
		Utils.changeDialog(1, Errors.get(1009));
		Utils.show('dialog');
	});
}

function editServer(){
	Utils.changeDialog(2, 'Uploading server data...');
	Utils.show('dialog');

	let data = {};
	let keys = Object.keys(serverData[type].inputs);
	let error = false;
	for(let i = 0; i < keys.length; i++){
		let id = keys[i].replace('server_', '');
		let value = document.getElementById(keys[i]).value;
		data[id] = (value !== '') ? value : null;

		// Validate
		if(!Validate[serverData[type].inputs[keys[i]].validate?.name](data[id]) && serverData[type].inputs[keys[i]].required){
			Utils.changeDialog(1, Errors.get(serverData[type].inputs[keys[i]].validate?.errorCode));
			Utils.show('dialog');
			error = true;
			return;
		}
	}

	if(error) return;

	data['categories'] = [];
	let categoryInputs = document.getElementsByName('categories');
	for(let i = 0; i < categoryInputs.length; i++){
		if(!categoryInputs[i].checked) continue;
		data['categories'].push(categoryInputs[i].value);
	};

	if(type === 'discord'){
		data['keywords'] = document.getElementById('server_keywords').value.split(',');
		data['token'] = localStorage.getItem('discord-oauth-token');
		data['invite_code'] = data['invite_code'].replaceAll('https://discord.gg/', '');
	}

	data['description'] = document.getElementById('description').value;
	data['secretToken'] = editData['secretToken'];

	if(type === 'minecraft' && !Validate.minecraftServerCategory(data['categories'])){
		Utils.changeDialog(1, 'Please select between one to five categories.');
		Utils.show('dialog');
		return;
	}

	if(!Validate.description(data['description'])){
		Utils.changeDialog(1, 'Description needs to be between 150 and 10 000 characters long.');
		Utils.show('dialog');
		return;
	}

	let headers = new Headers();
	headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
	headers.set('Content-Type', 'application/json');

	fetch('https://api.rabbitserverlist.com/v1/server/' + type + '/' + id, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(data)
	}).then(result => {
		return result.json();
	}).then(response => {

		if(response.error === 1040){
			localStorage.setItem('lastPage', window.location.href);
			window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1093795826238758962&redirect_uri=https%3A%2F%2Frabbitserverlist.com%2Foauth&response_type=token&scope=identify%20guilds&state=" + localStorage.getItem('userToken');
			return;
		}

		if(response.error !== 0){
			Utils.changeDialog(1, response.info);
			Utils.show('dialog');
			return;
		}

		localStorage.removeItem('my-servers-' + type);
		Utils.changeDialog(8, 'Server edited successfully!');
		Utils.show('dialog');
	}).catch(() => {
		Utils.changeDialog(1, Errors.get(1009));
		Utils.show('dialog');
	});
}

document.getElementById('btn-add').addEventListener('click', () => {
	if(id === null){
		addServer();
	}else{
		editServer();
	}
});