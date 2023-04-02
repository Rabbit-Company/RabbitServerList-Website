import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);
Utils.initialize();

const parms = new URLSearchParams(window.location.search);

let page = (parms.get('page') !== null && Utils.isPositiveInteger(parms.get('page'))) ? Number(parms.get('page')) : 1;
if(page > 50) page = 50;

let server = (parms.get('server') !== null && Utils.isPositiveInteger(parms.get('server'))) ? parms.get('server') : null;
let version = (parms.get('version') !== null && Validate.minecraftServerVersion(parms.get('version'))) ? parms.get('version') : null;
let category = (parms.get('category') !== null && Validate.minecraftServerCategoryList.includes(parms.get('category'))) ? parms.get('category') : null;
let country = (parms.get('country') !== null && Validate.country(parms.get('country'))) ? parms.get('country') : null;

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
		if(serverData.ip !== serverData.bedrock_ip || serverData.port !== 25565) tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Bedrock IP</td><td class='copyText cursor-pointer tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.bedrock_ip}</td></tr>`;
		tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Bedrock Port</td><td class='copyText cursor-pointer tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.bedrock_port}</td></tr>`;
	}
	// Status
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Status</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${online_color}'>${online}</span></td></tr>`;
	// Version
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Version</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><a href='?version=${serverData.version}'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${serverData.version}</span></a></td></tr>`;
	// Players
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Players</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.players} / ${serverData.players_max}</td></tr>`;
	// Links
	if(serverData.website || serverData.store || serverData.discord || serverData.twitter || serverData.trailer){
		tableHtml += `<tr><td class='secondaryColor px-4 py-4'>Links</td><td class='tertiaryColor px-4 py-4'>`;
		if(serverData.website) tableHtml += `<a href='${serverData.website}' target='_blank'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>Website</span></a>`;
		if(serverData.store) tableHtml += `<a href='${serverData.store}' target='_blank'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>Store</span></a>`;
		if(serverData.discord) tableHtml += `<a href='${serverData.discord}' target='_blank'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>Discord</span></a>`;
		if(serverData.twitter) tableHtml += `<a href='${serverData.twitter}' target='_blank'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>Twitter</span></a>`;
		if(serverData.trailer) tableHtml += `<a href='${serverData.trailer}' target='_blank'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>Trailer</span></a>`;
		tableHtml += `</td></tr>`;
	}
	// Owner
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Owner</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.owner}</td></tr>`;
	// Location
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Location</td><td class='tertiaryColor px-4 py-4'><a href='?country=${serverData.country}'>${Validate.countryList[serverData.country]}</a></td></tr>`;
	// Uptime
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Uptime</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${uptimeBadge}'>${serverData.uptime}%</span></td></tr>`;
	// Last Check
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Last Check</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${Utils.durationBetween(new Date(serverData.updated), new Date())}</td></tr>`;
	// Votes
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Votes</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.votes}</td></tr>`;

	let categoryBadges = "";
	let categories = serverData.categories.split(',');
	categories.forEach(category => {
		categoryBadges += `<a href='?category=${category}'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>${category}</span></a>`;
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
		<div class="mt-6 mb-6 mx-auto max-w-[468px] text-center">
			<form id="vote-form w-full">
				<b>YOU CAN VOTE ONCE A DAY!</b>
				<img class='rounded-md w-[468px] h-[60px]' width="468" height="60" src='https://api.rabbitserverlist.com/v1/server/minecraft/${id}/banner' />

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
		fetch('https://api.rabbitserverlist.com/v2/server/minecraft/' + id + '/vote', {
			method: 'POST',
			headers: headers,
			body: data
		}).then(result => {
			return result.json();
		}).then(response => {
			if(response.error === 3001 || response.error === 3002){
				Utils.changeDialog(9, response.info);
				Utils.show('dialog');
				return;
			}

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

	let date = Utils.fancyDate(new Date()).split(' ')[0];
	let stats = await Utils.fetchServerStats('minecraft', id);

	Chart.defaults.color = '#a7abb3';

	document.getElementById('description').innerHTML = `
	<input id="stats-date-picker" type="date" value="${date}" class="border" />
	<canvas id="serverPlayerChart" class="mt-3"></canvas>
	<canvas id="serverUptimeChart" class="mt-6"></canvas>
	`;

	let players = [];
	let minPlayers = [];
	let maxPlayers = [];
	let uptimes = [];
	let playerDates = [];
	let uptimeDates = [];

	let sortedPlayers = stats.players.sort((p1, p2) => (p1.hour > p2.hour) ? 1 : (p1.hour < p2.hour) ? -1 : 0);
	let sortedUptimes = stats.uptime.sort((p1, p2) => (p1.hour > p2.hour) ? 1 : (p1.hour < p2.hour) ? -1 : 0);

	sortedPlayers.forEach(value => {
		let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
		if(date2[0] !== date) return;
		playerDates.push(date2[1]);
		players.push(Math.round(value.avg));
		minPlayers.push(value.min);
		maxPlayers.push(value.max);
	});

	sortedUptimes.forEach(value => {
		let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
		if(date2[0] !== date) return;
		uptimeDates.push(date2[1]);
		uptimes.push(value.uptime);
	});

	const ctxPlayers = document.getElementById('serverPlayerChart');
	const ctxUptime = document.getElementById('serverUptimeChart');

	let serverPlayersChart = new Chart(ctxPlayers, {
		type: 'line',
		data: {
			labels: playerDates,
			datasets: [
				{
					label: 'Max. Players',
					data: maxPlayers,
					borderColor: '#035a2e',
					backgroundColor: '#035a2e',
					borderWidth: 2
				},
				{
					label: 'Avg. Players',
					data: players,
					borderColor: '#6ba0e4',
					backgroundColor: '#6ba0e4',
					borderWidth: 2
				},
				{
					label: 'Min. Players',
					data: minPlayers,
					borderColor: '#4f46e5',
					backgroundColor: '#4f46e5',
					borderWidth: 2
				}
			]
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
		minPlayers = [];
		maxPlayers = [];
		uptimes = [];
		playerDates = [];
		uptimeDates = [];

		sortedPlayers.forEach(value => {
			let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
			if(date2[0] !== date) return;
			playerDates.push(date2[1]);
			players.push(Math.round(value.avg));
			minPlayers.push(value.min);
			maxPlayers.push(value.max);
		});

		sortedUptimes.forEach(value => {
			let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
			if(date2[0] !== date) return;
			uptimeDates.push(date2[1]);
			uptimes.push(value.uptime);
		});

		serverPlayersChart.data.labels = playerDates;
		serverPlayersChart.data.datasets[0].data = maxPlayers;
		serverPlayersChart.data.datasets[1].data = players;
		serverPlayersChart.data.datasets[2].data = minPlayers;

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

		data += "<tr class='passwordsBorderColor'>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden xl:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + (i + 1) + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 hidden 2xl:table-cell'><a href='?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += `<td class='sm:w-[500px] text-center px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
			<div class='hidden sm:block'>
				<a href='?server=${servers[i].id}'>
					<img class='rounded-t-md w-[468px] h-[60px]' width="468" height="60" src='https://api.rabbitserverlist.com/v1/server/minecraft/${servers[i].id}/banner' alt='${servers[i].name}' />
				</a>
				<span class='w-full inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium ${online_color}'>
					<a class='copyText cursor-pointer'>${ip}</a>
				</span>
			</div>
			<div class='sm:hidden'>
				<a href='?server=${servers[i].id}'>
					<img class='rounded-md m-auto h-[60px]' width="468" height="60" src='https://api.rabbitserverlist.com/v1/server/minecraft/${servers[i].id}/banner' alt='${servers[i].name}' />
				</a>

				<span class='mt-2 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium ${online_color}'>${online}</span>
				<a href='?version=${servers[i].version}'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${servers[i].version}</span></a>
				<span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>${servers[i].players} / ${servers[i].players_max}</span>
				<br>
				<span class='mt-2 w-full max-w-[468px] inline-flex items-center justify-center px-2.5 py-0.5 text-sm rounded-md font-medium ${online_color}'>
					<a class='copyText cursor-pointer'>${ip}</a>
				</span>
			</div>
		</td>`;
		data += "<td class='px-4 py-4 hidden lg:table-cell'><div>";
		for(let j = 0; j < categories.length; j++) data += "<a href='?category=" + categories[j] + "'><span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + categories[j] + "</span></a>";
		data += "</div></td><td class='tertiaryColor py-4 px-4 whitespace-nowrap hidden sm:table-cell'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden md:table-cell'><a href='?version=" + servers[i].version + "'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>" + servers[i].version + "</span></a></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap hidden xl:table-cell'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + online + "</span></td>";
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

	// Pagination
	if(page !== 1 || servers.length >= 20){
		document.getElementById('pagination').style = 'display: block;';
	}

	if(servers.length !== 20){
		document.getElementById('pagination-right').style = 'display: none;';
	}

	if(page == 1){
		document.getElementById('pagination-left').style = 'display: none;';
	}

	let startFrom = ((page - 1) * 20) + 1;
	const parms = new URLSearchParams(window.location.search);
	document.getElementById('page').value = page;

	parms.set('page', page - 1);
	document.getElementById('pagination-left').href = '?' + parms;

	parms.set('page', page + 1);
	document.getElementById('pagination-right').href = '?' + parms;

	document.getElementById('label-startFrom').innerText = startFrom;
	document.getElementById('label-stopOn').innerText = (page === 1) ? ((startFrom + servers.length) - 1) : startFrom + servers.length;

	document.getElementById("page").addEventListener("keypress", (event) => {
		if (event.key !== "Enter") return;
		event.preventDefault();

		const parms = new URLSearchParams(window.location.search);
		parms.set('page', document.getElementById("page").value);

		window.location.assign('?' + parms);
	});
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

	if(version !== null){
		let servers = JSON.parse(localStorage.getItem('servers-minecraft-' + page + '-filter-version-' + version));
		if(servers !== null) return renderServers(servers);

		let data = await Utils.fetchServers('minecraft', page, 'version', version);
		renderServers(data);
		return;
	}else if(category !== null){
		let servers = JSON.parse(localStorage.getItem('servers-minecraft-' + page + '-filter-category-' + category));
		if(servers !== null) return renderServers(servers);

		let data = await Utils.fetchServers('minecraft', page, 'category', category);
		renderServers(data);
		return;
	}else if(country !== null){
		let servers = JSON.parse(localStorage.getItem('servers-minecraft-' + page + '-filter-country-' + country));
		if(servers !== null) return renderServers(servers);

		let data = await Utils.fetchServers('minecraft', page, 'country', country);
		renderServers(data);
		return;
	}

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