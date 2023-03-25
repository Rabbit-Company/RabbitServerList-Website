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
	Utils.fhide("tabs-1-panel-2");
	Utils.fshow("tabs-1-panel-1", "block");
});

document.getElementById("tabs-1-tab-2").addEventListener("click", () => {
	Utils.fhide("tabs-1-panel-1");

	let description = document.getElementById("description").value;
	let html = marked.parse(description, {
		gfm: true,
		breaks: true,
		sanitizer: DOMPurify.sanitize
	});
	document.getElementById('preview').innerHTML = html;

	Utils.fshow("tabs-1-panel-2", "block");
});

const parms = new URLSearchParams(window.location.search);

let type = parms.get('type');
if(type === null || !['minecraft'].includes(type)) location.href = "panel.html";

let id = (parms.get('id') !== null && Utils.isPositiveInteger(parms.get('id'))) ? parms.get('id') : null;

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
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_ip': {
				'type': 'text',
				'name': 'ip',
				'placeholder': 'IP',
				'required': true,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='4' width='18' height='8' rx='3' /><rect x='3' y='12' width='18' height='8' rx='3' /><line x1='7' y1='8' x2='7' y2='8.01' /><line x1='7' y1='16' x2='7' y2='16.01' />"
			},
			'server_port': {
				'type': 'number',
				'name': 'port',
				'placeholder': 'Port',
				'required': true,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='4' width='18' height='8' rx='3' /><rect x='3' y='12' width='18' height='8' rx='3' /><line x1='7' y1='8' x2='7' y2='8.01' /><line x1='7' y1='16' x2='7' y2='16.01' />"
			},
			'server_bedrock_ip': {
				'type': 'text',
				'name': 'bedrock_ip',
				'placeholder': 'Bedrock IP (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_bedrock_port': {
				'type': 'number',
				'name': 'bedrock_port',
				'placeholder': 'Bedrock Port (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_website': {
				'type': 'text',
				'name': 'website',
				'placeholder': 'Website (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><polyline points='5 12 3 12 12 3 21 12 19 12' /><path d='M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7' /><path d='M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6' />"
			},
			'server_discord': {
				'type': 'text',
				'name': 'discord',
				'placeholder': 'Discord (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='9' cy='12' r='1' /><circle cx='15' cy='12' r='1' /><path d='M7.5 7.5c3.5 -1 5.5 -1 9 0' /><path d='M7 16.5c3.5 1 6.5 1 10 0' /><path d='M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5' /><path d='M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5' />"
			},
			'server_twitter': {
				'type': 'text',
				'name': 'twitter',
				'placeholder': 'Twitter (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><path d='M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z' />"
			},
			'server_store': {
				'type': 'text',
				'name': 'store',
				'placeholder': 'Store (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='6' cy='19' r='2' /><circle cx='17' cy='19' r='2' /><path d='M17 17h-11v-14h-2' /><path d='M6 5l14 1l-1 7h-13' />"
			},
			'server_trailer': {
				'type': 'text',
				'name': 'trailer',
				'placeholder': 'Trailer [Youtube Video] (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><rect x='3' y='5' width='18' height='14' rx='4' /><path d='M10 9l5 3l-5 3z' />"
			},
			'server_version': {
				'type': 'select',
				'name': 'version',
				'placeholder': 'Version',
				'options': Validate.minecraftServerVersionList,
				'required': true,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_country': {
				'type': 'select',
				'name': 'country',
				'placeholder': 'Country',
				'options': Validate.countryList,
				'required': true,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='12' cy='12' r='9' /><line x1='3.6' y1='9' x2='20.4' y2='9' /><line x1='3.6' y1='15' x2='20.4' y2='15' /><path d='M11.5 3a17 17 0 0 0 0 18' /><path d='M12.5 3a17 17 0 0 1 0 18' />"
			},
			'server_votifier_ip': {
				'type': 'text',
				'name': 'votifier_ip',
				'placeholder': 'Votifier IP (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_votifier_port': {
				'type': 'number',
				'name': 'votifier_port',
				'placeholder': 'Votifier Port (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M19 4v16h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h12z'></path><path d='M19 16h-12a2 2 0 0 0 -2 2'></path><path d='M9 8h6'></path>"
			},
			'server_votifier_token': {
				'type': 'text',
				'name': 'votifier_token',
				'placeholder': 'Votifier Token (Optional)',
				'required': false,
				'icon': "<path stroke='none' d='M0 0h24v24H0z' fill='none'/><circle cx='8' cy='15' r='4' /><line x1='10.85' y1='12.15' x2='19' y2='4' /><line x1='18' y1='5' x2='20' y2='7' /><line x1='15' y1='8' x2='17' y2='10' />"
			}
		}
	}
}

document.getElementById('title-1').innerText = serverData[type].title1;
document.getElementById('desc-1').innerText = serverData[type].desc1;

if(id !== null){
	document.getElementById('btn-add').innerText = 'Edit';
}

let html = "";
let inputs = Object.keys(serverData[type].inputs);
for(let i = 0; i < inputs.length; i++){
	let data = serverData[type].inputs[inputs[i]];
	if(data.type === 'select'){

		let options = "";
		if(Array.isArray(data.options)){
			data.options.forEach(option => {
				options += `<option>${option}</option>`;
			});
		}else{
			let keys = Object.keys(data.options);
			for(let j = 0; j < keys.length; j++){
				options += `<option value="${keys[j]}">${data.options[keys[j]]}</option>`;
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
		html += `
		<div>
			<label for="${data.name}" class="sr-only">Title</label>
			<div class="relative rounded-md shadow-sm">
				<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 secondaryColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
						${data.icon}
					</svg>
				</div>
				<input id="${inputs[i]}" name="${data.name}" type="${data.type}" autocomplete="off" ${required} class="tertiaryBackgroundColor tertiaryColor primaryBorderColor appearance-none rounded-none block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm" placeholder="${data.placeholder}">
			</div>
		</div>`;
	}
}
document.getElementById('inputs').innerHTML = html;

html = "";
if(type === 'minecraft'){
	Validate.minecraftServerCategoryList.forEach(category => {
		html += "<input type='checkbox' name='categories' value='" + category + "'> " + category + "</br>";
	});
}
document.getElementById('categories').innerHTML = html;