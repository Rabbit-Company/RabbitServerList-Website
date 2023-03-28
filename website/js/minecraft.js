import Utils from './utils.js';
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
	// Total Votes
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Total Votes</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.votes_total}</td></tr>`;

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

async function renderServerStats(id){
	document.getElementById('description').innerHTML = "Loading data...";

	let stats = await Utils.fetchServerStats('minecraft', id);

	Chart.defaults.color = '#a7abb3';

	document.getElementById('description').innerHTML = `
	<canvas id="serverPlayerChart" class="mt-3"></canvas>
	<canvas id="serverUptimeChart" class="mt-6"></canvas>
	`;

	let playerDates = [];
	let players = [];
	stats.players.forEach(value => {
		playerDates.push(value.hour);
		players.push(value.players);
	});

	let uptimeDates = [];
	let uptimes = [];
	stats.uptime.forEach(value => {
		uptimeDates.push(value.hour);
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

	//document.getElementById('description').innerHTML = JSON.stringify(stats);
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