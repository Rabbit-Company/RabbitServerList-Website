import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Utils.initialize();

const parms = new URLSearchParams(window.location.search);

let page = (parms.get('page') !== null && Utils.isPositiveInteger(parms.get('page'))) ? parms.get('page') : 1;
if(page > 50) page = 50;

let server = (parms.get('server') !== null && Utils.isPositiveInteger(parms.get('server'))) ? parms.get('server') : null;

function renderServer(serverData){
	document.getElementById('servers').className = "hidden";
	document.getElementById('server').className = "";

	document.getElementById('server-title').innerText = serverData.name;

	renderServerDescription(serverData.description);

	let tableHtml = "";

	let online = (serverData.online === serverData.updated) ? "Online" : "Offline";
	let online_color = (serverData.online === serverData.updated) ? "greenBadge" : "redBadge";

	let uptimeBadge = 'greenBadge';
	if(serverData.uptime < 90) uptimeBadge = 'orangeBadge';
	if(serverData.uptime < 80) uptimeBadge = 'redBadge';

	// IP
	let ip = (serverData.port !== 25565) ? serverData.ip + ':' + serverData.port : serverData.ip;
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>IP</td><td class='copyText cursor-pointer tertiaryColor px-4 py-4 whitespace-nowrap'>${ip}</td></tr>`;
	// Bedrock IP
	if(serverData.bedrock_ip !== null && serverData.bedrock_port !== null){
		let bedrock_ip = (serverData.bedrock_port !== 19132) ? serverData.bedrock_ip + ':' + serverData.bedrock_port : serverData.bedrock_ip;
		tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Bedrock IP</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${bedrock_ip}</td></tr>`;
	}
	// Status
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Status</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${online_color}'>${online}</span></td></tr>`;
	// Version
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Version</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${serverData.version}</span></td></tr>`;
	// Players
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Players</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.players} / ${serverData.players_max}</td></tr>`;
	// Owner
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Owner</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.owner}</td></tr>`;
	// Location
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Location</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${Validate.countryList[serverData.country]}</td></tr>`;
	// Uptime
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Uptime</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${uptimeBadge}'>${serverData.uptime}%</span></td></tr>`;
	// Last Check
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Last Check</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${Utils.durationBetween(new Date(serverData.updated), new Date())}</td></tr>`;
	// Monthly Votes
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Monthly Votes</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.votes}</td></tr>`;

	let categoryBadges = "";
	let categories = serverData.categories.split(',');
	categories.forEach(category => {
		categoryBadges += `<span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>${category}</span>`;
	});

	// Categories
	tableHtml += `<tr><td class='secondaryColor px-4 py-4'>Categories</td><td class='tertiaryColor px-4 py-4'>${categoryBadges}</td></tr>`;

	document.getElementById('server_table_data').innerHTML = tableHtml;

	let copyElements = document.getElementsByClassName('copyText');
	for(let i = 0; i < copyElements.length; i++){
		copyElements[i].addEventListener('click', () => {
			let text = copyElements[i].innerText;
			if(text === 'Copied!') return;
			Utils.copyToClipboard(text);
			copyElements[i].innerText = "Copied!";
			window.setTimeout(() => {
				copyElements[i].innerText = text;
			}, 1000);
		});
	}

	document.getElementById('tabs-1-tab-1').addEventListener('click', () => {
		renderServerDescription(serverData.description);
	});

	document.getElementById('tabs-1-tab-2').addEventListener('click', () => {
		renderServerVote(serverData.id);
	});

	document.getElementById('tabs-1-tab-3').addEventListener('click', () => {
		renderServerStats(serverData.id);
	});
}

function renderServerDescription(description){
	let html = marked.parse(description, {
		gfm: true,
		breaks: true,
		sanitizer: DOMPurify.sanitize
	});

	document.getElementById('description').innerHTML = html;
}

function renderServerVote(id){
	document.getElementById('description').innerHTML = `
		<div class="mt-6 mb-6 mx-auto max-w-sm text-center">
			<form id="vote-form">
				<b>YOU CAN VOTE ONCE A DAY!</b>
				<img class='rounded-md w-full' src='https://api.rabbitserverlist.com/v1/server/minecraft/${id}/banner' />

				<div class="mt-3">
					<label for="minecraft-username" class="sr-only">Minecraft Username</label>
					<div class="relative rounded-md shadow-sm">
						<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
							<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 secondaryColor" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
								<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
								<circle cx="12" cy="7" r="4"></circle>
								<path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"></path>
							</svg>
						</div>
						<input id="minecraft-username" name="minecraft-username" type="text" autocomplete="minecraft-username" required class="tertiaryBackgroundColor tertiaryColor primaryBorderColor appearance-none rounded-md block w-full pl-10 px-3 py-2 border focus:outline-none focus:z-10 sm:text-sm" placeholder="Minecraft Username">
					</div>
				</div>

				<div id="cf-turnstile" class="cf-turnstile mt-3" data-sitekey="0x4AAAAAAADkDTSJrhqVLN33" data-action="vote" data-theme="dark" data-language="en" data-callback="onloadTurnstileCallback"></div>

				<button id="btn_vote" type="submit" class="primaryButton w-full py-2 px-4 mt-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none">
					Submit Vote
				</button>

			</form>
		</div>
	`;

	turnstile.render('#cf-turnstile');

	document.getElementById("vote-form").addEventListener("submit", e => {
		e.preventDefault();

		let username = document.getElementById('minecraft-username').value;
		let turnstile = document.getElementsByName('cf-turnstile-response')[0].value;

		Utils.changeDialog(2, 'Sending vote...');
		Utils.show('dialog');

		let headers = new Headers();
		headers.set('Content-Type', 'application/json');

		let data = JSON.stringify({ "username": username, "turnstile": turnstile });
		fetch('https://api.rabbitserverlist.com/v1/server/minecraft/' + id + '/vote', {
			method: 'POST',
			headers: headers,
			body: data
		}).then(result => {
			return result.json();
		}).then(response => {
			if(response.error !== 0){
				Utils.changeDialog(1, response.info);
				Utils.show('dialog');
				return;
			}
			console.log(response);
			Utils.changeDialog(0, 'Vote sent!');
			Utils.show('dialog');
		}).catch(() => {
			Utils.changeDialog(1, Errors.get(1009));
			Utils.show('dialog');
		});

	});
}

async function renderServerStats(id){
	document.getElementById('description').innerHTML = "Loading data...";

	let date = new Date().toISOString().split('T')[0];
	let stats = await Utils.fetchServerStats('minecraft', id);

	Chart.defaults.color = '#a7abb3';

	document.getElementById('description').innerHTML = `
	<input id="stats-date-picker" type="date" value="${date}" class="border" />
	<canvas id="serverPlayerChart" class="mt-3"></canvas>
	<canvas id="serverUptimeChart" class="mt-6"></canvas>
	`;

	let players = [];
	let uptimes = [];
	let playerDates = [];
	let uptimeDates = [];

	let sortedPlayers = stats.players.sort((p1, p2) => (p1.hour > p2.hour) ? 1 : (p1.hour < p2.hour) ? -1 : 0);
	let sortedUptimes = stats.uptime.sort((p1, p2) => (p1.hour > p2.hour) ? 1 : (p1.hour < p2.hour) ? -1 : 0);

	sortedPlayers.forEach(value => {
		if(new Date(value.hour).toISOString().split('T')[0] !== date) return;
		playerDates.push(value.hour.replace(date, ''));
		players.push(Math.round(value.players));
	});

	sortedUptimes.forEach(value => {
		if(new Date(value.hour).toISOString().split('T')[0] !== date) return;
		uptimeDates.push(value.hour.replace(date, ''));
		uptimes.push(value.uptime);
	});

	const ctxPlayers = document.getElementById('serverPlayerChart');
	const ctxUptime = document.getElementById('serverUptimeChart');

	let serverPlayersChart = new Chart(ctxPlayers, {
		type: 'line',
		data: {
			labels: playerDates,
			datasets: [{
				label: 'Players',
				data: players,
				borderColor: '#2563eb',
				backgroundColor: '#2563eb',
				borderWidth: 2
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
			scale: {
				ticks: {
					precision: 0
				}
			}
		}
	});

	let serverUptimeChart = new Chart(ctxUptime, {
		type: 'line',
		data: {
			labels: uptimeDates,
			datasets: [{
				label: 'Uptime',
				data: uptimes,
				borderColor: '#2563eb',
				backgroundColor: '#2563eb',
				borderWidth: 2
			}]
		},
		options: {
			scales: {
				y: {
					beginAtZero: true
				}
			},
			scale: {
				ticks: {
					precision: 0
				}
			}
		}
	});

	document.getElementById('stats-date-picker').addEventListener('input', () => {
		let date = document.getElementById('stats-date-picker').value;

		players = [];
		uptimes = [];
		playerDates = [];
		uptimeDates = [];

		sortedPlayers.forEach(value => {
			if(new Date(value.hour).toISOString().split('T')[0] !== date) return;
			playerDates.push(value.hour.replace(date, ''));
			players.push(Math.round(value.players));
		});

		sortedUptimes.forEach(value => {
			if(new Date(value.hour).toISOString().split('T')[0] !== date) return;
			uptimeDates.push(value.hour.replace(date, ''));
			uptimes.push(value.uptime);
		});

		serverPlayersChart.data.labels = playerDates;
		serverPlayersChart.data.datasets[0].data = players;

		serverUptimeChart.data.labels = uptimeDates;
		serverUptimeChart.data.datasets[0].data = uptimes;

		serverPlayersChart.update();
		serverUptimeChart.update();
	});

}

function renderServers(servers){
	let data = "";

	for(let i = 0; i < servers.length; i++){
		let ip = (servers[i].port !== 25565) ? servers[i].ip + ':' + servers[i].port : servers[i].ip;
		let online = (servers[i].online === servers[i].updated) ? "Online" : "Offline";
		let online_color = (servers[i].online === servers[i].updated) ? "greenBadge" : "redBadge";
		let categories = servers[i].categories.split(',');

		data += "<tr>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + (i + 1) + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 whitespace-nowrap'><a href='?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += "<td class='text-center px-4 py-4 whitespace-nowrap text-sm text-gray-500'><a href='?server=" + servers[i].id + "'><img class='rounded-t-md w-full' src='https://api.rabbitserverlist.com/v1/server/minecraft/" + servers[i].id + "/banner' /></a><span class='w-full inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium " + online_color + "'><a class='copyText cursor-pointer'>" + ip + "</a></span></td>";
		data += "<td class='px-4 py-4'><div>";
		for(let j = 0; j < categories.length; j++) data += "<span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + categories[j] + "</span>";
		data += "</div></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>" + servers[i].version + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + online + "</span></td>";
		data += "</tr>";
	}

	document.getElementById("table_data").innerHTML = data;

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
}

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
	Utils.toggleMenu();
});

try{
	document.getElementById('logout').addEventListener('click', () => {
		Utils.logout();
	});
}catch{}

async function loadServerPage(){
	let serverData = JSON.parse(localStorage.getItem('server-minecraft-' + server));
	if(serverData !== null) return renderServer(serverData);

	let data = await Utils.fetchServer('minecraft', server);
	if(data !== null) return renderServer(data);

	window.location.href = '/';
}

async function loadServersPage(){
	let servers = JSON.parse(localStorage.getItem('servers-minecraft-' + page));
	if(servers !== null) return renderServers(servers);

	let data = await Utils.fetchServers('minecraft', page);
	renderServers(data);
}

if(server !== null){
	loadServerPage();
}else{
	loadServersPage();
}