import Utils from './utils.js';
import Errors from './errors.js';
import Validate from './validate.js';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { Chart, registerables } from 'chart.js';
import ColorThief from 'colorthief';

Chart.register(...registerables);
Utils.initialize();

const parms = new URLSearchParams(window.location.search);

let page = (parms.get('page') !== null && Utils.isPositiveInteger(parms.get('page'))) ? Number(parms.get('page')) : 1;
if(page > 50) page = 50;

let server = (parms.get('server') !== null && Utils.isPositiveInteger(parms.get('server'))) ? parms.get('server') : null;
let category = (parms.get('category') !== null && Validate.discordServerCategory(parms.get('category'))) ? parms.get('category') : null;
let query = (parms.get('q') !== null && Validate.query(parms.get('q'))) ? parms.get('q') : null;

// Search
try{
	if(query !== null){
		document.getElementById("search").value = query;
	}

	document.getElementById("search").addEventListener("keypress", (event) => {
		if (event.key !== "Enter" && event.key !== " ") return;
		event.preventDefault();
		let search = document.getElementById("search").value.split(' ')[0];
		if(Validate.query(search) || search.length === 0) window.location.assign("?q=" + search);
	});
}catch{}

function renderServerTableStats(serverData){
	let tableHtml = "";

	// Link
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Invite Code</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'><a href='https://discord.gg/${serverData.invite_code}' target='_blank'>${serverData.invite_code}</a></td></tr>`;
	// Members
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Members</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.members} / ${serverData.members_total}</td></tr>`;
	// Owner
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Owner</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.owner}</td></tr>`;
	// Last Check
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Last Check</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${Utils.durationBetween(new Date(serverData.updated), new Date())}</td></tr>`;
	// Votes
	tableHtml += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'>Votes</td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${serverData.votes}</td></tr>`;

	let keywordsBadges = "";
	let keywords = serverData.keywords.split(',');
	keywords.forEach(keyword => {
		keywordsBadges += `<a href='discord.html?q=${keyword}'><span class='inline-flex items-center px-2.5 py-0.5 m-0.5 rounded-md text-sm font-medium grayBadge'>${keyword}</span></a>`;
	});

	// Keywords
	tableHtml += `<tr><td class='secondaryColor px-4 py-4'>Keywords</td><td class='tertiaryColor px-4 py-4'>${keywordsBadges}</td></tr>`;

	return tableHtml;
}

function renderServer(serverData){
	document.getElementById('servers').className = "hidden";
	document.getElementById('server').className = "";

	document.getElementById('server-title').innerText = serverData.name;

	renderServerDescription(serverData.description);

	document.getElementById('server_table_data').innerHTML = renderServerTableStats(serverData);

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
		document.getElementById('server_table_data').innerHTML = renderServerTableStats(serverData);
		renderServerDescription(serverData.description);
	});

	document.getElementById('tabs-1-tab-2').addEventListener('click', () => {
		renderServerVote(serverData.id, serverData.guild_id, serverData.icon);
	});

	document.getElementById('tabs-1-tab-3').addEventListener('click', () => {
		document.getElementById('server_table_data').innerHTML = renderServerTableStats(serverData);
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

function renderServerVote(id, guild_id, icon){
	document.getElementById('description').innerHTML = `
		<div class="mt-6 mb-6 mx-auto max-w-[468px] text-center">
			<form id="vote-form" class="w-full">
				<b>YOU CAN VOTE ONCE A DAY!</b>

				<div class="mt-3">
					<img id="discord-server-logo" crossorigin="anonymous" class="bg-gradient-to-b from-[#161b22] to-[#28313e] border tertiaryBorderColor mx-auto w-[96px] h-[96px] rounded-full" width="96" height="96" src="https://cdn.discordapp.com/icons/${guild_id}/${icon}">
				</div>

				<div id="cf-turnstile" class="cf-turnstile mt-3" data-sitekey="0x4AAAAAAADkDTSJrhqVLN33" data-action="vote" data-theme="dark" data-language="en" data-callback="onloadTurnstileCallback"></div>

				<button id="btn_vote" type="submit" class="primaryButton w-full py-2 px-4 mt-3 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none">
					Submit Vote
				</button>

			</form>
		</div>
	`;

	turnstile.render('#cf-turnstile');

	const colorThief = new ColorThief();
	let img = document.getElementById('discord-server-logo');
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

	document.getElementById("vote-form").addEventListener("submit", e => {
		e.preventDefault();

		let access_token = localStorage.getItem('discord-oauth-token');
		let turnstile = document.getElementsByName('cf-turnstile-response')[0].value;

		if(access_token === null){
			Utils.changeDialog(2, 'Loading...');
			Utils.show('dialog');
			localStorage.setItem('lastPage', window.location.href);
			window.location.href = "https://discord.com/api/oauth2/authorize?client_id=1093795826238758962&redirect_uri=https%3A%2F%2Frabbitserverlist.com%2Foauth&response_type=token&scope=identify%20guilds&state=" + localStorage.getItem('userToken');
			return;
		}

		Utils.changeDialog(2, 'Sending vote...');
		Utils.show('dialog');

		let headers = new Headers();
		headers.set('Content-Type', 'application/json');

		let data = JSON.stringify({ "token": access_token, "turnstile": turnstile });
		fetch('https://api.rabbitserverlist.com/v1/server/discord/' + id + '/vote', {
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
			console.log(response);
			Utils.changeDialog(0, 'Vote sent!');
			Utils.show('dialog');
		}).catch(() => {
			Utils.changeDialog(1, Errors.get(1009));
			Utils.show('dialog');
		});

	});

	fetch(`https://api.rabbitserverlist.com/v1/server/discord/${id}/vote`).then(result => {
		return result.json();
	}).then(response => {
		if(response.error !== 0) return;
		if(response.data.length === 0) return;

		let data = response.data;
		let ids = Object.keys(data).sort((u1,u2) => data[u1].votes - data[u2].votes);

		let html = `<tr><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>TOP 10 VOTERS</td></tr>`;
		for(let i = 0; i < ids.length; i++){
			if(i > 10) break;
			html += `<tr><td class='secondaryColor px-4 py-4 whitespace-nowrap'><a href='https://discord.com/users/${ids[i]}' target='_blank'><div class="flex items-center gap-x-4"><img class="h-10 w-10 rounded-full" width="40" height="40" src="https://cdn.discordapp.com/avatars/${ids[i]}/${data[ids[i]].avatar}" alt="${data[ids[i]].username}#${data[ids[i]].discriminator}"><div class="tertiaryColor">${data[ids[i]].username}<span class="secondaryColor">#${data[ids[i]].discriminator}</span></div></div></a></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>${data[ids[i]].votes}</td></tr>`;
		}

		document.getElementById('server_table_data').innerHTML = html;
	}).catch(() => {});
}

async function renderServerStats(id){
	document.getElementById('description').innerHTML = "Loading data...";

	let date = Utils.fancyDate(new Date()).split(' ')[0];
	let stats = await Utils.fetchServerStats('discord', id);

	Chart.defaults.color = '#a7abb3';

	document.getElementById('description').innerHTML = `
	<input id="stats-date-picker" type="date" value="${date}" class="border" />
	<canvas id="serverMemberChart" class="mt-3"></canvas>
	<canvas id="serverMemberTotalChart" class="mt-6"></canvas>
	`;

	let members = [];
	let minMembers = [];
	let maxMembers = [];

	let members_total = [];
	let minMembersTotal = [];
	let maxMembersTotal = [];

	let memberDates = [];
	let membersTotalDates = [];

	let sortedMembers = stats.members.sort((p1, p2) => (p1.hour > p2.hour) ? 1 : (p1.hour < p2.hour) ? -1 : 0);
	let sortedMembersTotal = stats.members_total.sort((p1, p2) => (p1.hour > p2.hour) ? 1 : (p1.hour < p2.hour) ? -1 : 0);

	sortedMembers.forEach(value => {
		let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
		if(date2[0] !== date) return;
		memberDates.push(date2[1]);
		members.push(Math.round(value.avg));
		minMembers.push(value.min);
		maxMembers.push(value.max);
	});

	sortedMembersTotal.forEach(value => {
		let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
		if(date2[0] !== date) return;
		membersTotalDates.push(date2[1]);
		members_total.push(Math.round(value.avg));
		minMembersTotal.push(value.min);
		maxMembersTotal.push(value.max);
	});

	const ctxMembers = document.getElementById('serverMemberChart');
	const ctxMemberTotal = document.getElementById('serverMemberTotalChart');

	let serverMembersChart = new Chart(ctxMembers, {
		type: 'line',
		data: {
			labels: memberDates,
			datasets: [
				{
					label: 'Max. Active Members',
					data: maxMembers,
					borderColor: '#035a2e',
					backgroundColor: '#035a2e',
					borderWidth: 2
				},
				{
					label: 'Avg. Active Members',
					data: members,
					borderColor: '#6ba0e4',
					backgroundColor: '#6ba0e4',
					borderWidth: 2
				},
				{
					label: 'Min. Active Members',
					data: minMembers,
					borderColor: '#4f46e5',
					backgroundColor: '#4f46e5',
					borderWidth: 2
				}
			]
		},
		options: {
			scale: {
				ticks: {
					precision: 0
				}
			}
		}
	});

	let serverMembersTotalChart = new Chart(ctxMemberTotal, {
		type: 'line',
		data: {
			labels: membersTotalDates,
			datasets: [
				{
					label: 'Max. Members',
					data: maxMembersTotal,
					borderColor: '#035a2e',
					backgroundColor: '#035a2e',
					borderWidth: 2
				},
				{
					label: 'Avg. Members',
					data: members_total,
					borderColor: '#6ba0e4',
					backgroundColor: '#6ba0e4',
					borderWidth: 2
				},
				{
					label: 'Min. Members',
					data: minMembersTotal,
					borderColor: '#4f46e5',
					backgroundColor: '#4f46e5',
					borderWidth: 2
				}
			]
		},
		options: {
			scale: {
				ticks: {
					precision: 0
				}
			}
		}
	});

	document.getElementById('stats-date-picker').addEventListener('input', () => {
		let date = document.getElementById('stats-date-picker').value;

		members = [];
		minMembers = [];
		maxMembers = [];

		members_total = [];
		minMembersTotal = [];
		maxMembersTotal = [];

		memberDates = [];
		membersTotalDates = [];

		sortedMembers.forEach(value => {
			let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
			if(date2[0] !== date) return;
			memberDates.push(date2[1]);
			members.push(Math.round(value.avg));
			minMembers.push(value.min);
			maxMembers.push(value.max);
		});

		sortedMembersTotal.forEach(value => {
			let date2 = Utils.fancyDate(new Date(value.hour + 'Z')).split(' ');
			if(date2[0] !== date) return;
			membersTotalDates.push(date2[1]);
			members_total.push(Math.round(value.avg));
			minMembersTotal.push(value.min);
			maxMembersTotal.push(value.max);
		});

		serverMembersChart.data.labels = memberDates;
		serverMembersChart.data.datasets[0].data = maxMembers;
		serverMembersChart.data.datasets[1].data = members;
		serverMembersChart.data.datasets[2].data = minMembers;

		serverMembersTotalChart.data.labels = membersTotalDates;
		serverMembersTotalChart.data.datasets[0].data = maxMembersTotal;
		serverMembersTotalChart.data.datasets[1].data = members_total;
		serverMembersTotalChart.data.datasets[2].data = minMembersTotal;

		serverMembersChart.update();
		serverMembersTotalChart.update();
	});

}

function renderServers(servers){
	let data = "";

	for(let i = 0; i < servers.length; i++){
		let keywords = servers[i].keywords.split(',');
		let keywordsHTML = "";
		for(let j = 0; j < keywords.length; j++){
			if(j >= 5) break;
			keywordsHTML += "<a href='discord.html?q=" + keywords[j] + "'><span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + keywords[j] + "</span></a>";
		}

		data += `<li id="discord-server-${servers[i].id}" class="secondaryBackgroundColor col-span-1 flex flex-col divide-y passwordsBorderColor rounded-lg text-center shadow bg-no-repeat bg-center bg-cover">
		<div class="flex flex-1 flex-col p-8 bg-gradient-to-t from-[#161b22] via-[#1e252e]">
			<a href="discord.html?server=${servers[i].id}"><img id="discord-server-${servers[i].id}-logo" crossorigin="anonymous" class="bg-gradient-to-b from-[#161b22] to-[#28313e] border tertiaryBorderColor mx-auto w-[96px] h-[96px] flex-shrink-0 rounded-full" width="96" height="96" src="https://cdn.discordapp.com/icons/${servers[i].guild_id}/${servers[i].icon}" alt="${servers[i].name}"></a>
			<a href="discord.html?server=${servers[i].id}"><h3 class="mt-6 text-sm font-medium tertiaryColor">${servers[i].name}</h3></a>
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
					<a href="discord.html?server=${servers[i].id}" class="tertiaryColor passwordsBorderColor relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border-t border-r border-transparent py-4 text-sm font-semibold">
						<svg class="h-6 w-6" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0"></path>
							<path d="M12 9h.01"></path>
							<path d="M11 12h1v4h1"></path>
						</svg>
						INFO
					</a>
				</div>
				<div class="-ml-px flex w-0 flex-1">
					<a href="https://discord.gg/${servers[i].invite_code}" target="_blank" class="tertiaryColor passwordsBorderColor relative inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-br-lg border-t border-transparent py-4 text-sm font-semibold">
						<svg class="h-6 w-6" stroke="currentColor" viewBox="0 0 24 24" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
							<path d="M8 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
							<path d="M14 12a1 1 0 1 0 2 0a1 1 0 0 0 -2 0"></path>
							<path d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l.975 1.923a11.913 11.913 0 0 1 4.053 0l.972 -1.923c1.5 .16 3.043 .485 4.5 1.5c2 5.667 2.167 9.833 1.5 11.5c-.667 1.333 -2 3 -3.5 3c-.5 0 -2 -2 -2 -3"></path>
							<path d="M7 16.5c3.5 1 6.5 1 10 0"></path>
						</svg>
						JOIN
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
	let serverData = JSON.parse(localStorage.getItem('server-discord-' + server));
	if(serverData !== null) return renderServer(serverData);

	let data = await Utils.fetchServer('discord', server);
	if(data !== null) return renderServer(data);

	window.location.href = '/';
}

async function loadServersPage(){

	if(query !== null){
		let servers = JSON.parse(localStorage.getItem('servers-discord-' + page + '-filter-query-' + query));
		if(servers !== null) return renderServers(servers);

		let data = await Utils.fetchServers('discord', page, 'query', query);
		renderServers(data);
		return;
	}else if(category !== null){
		let servers = JSON.parse(localStorage.getItem('servers-discord-' + page + '-filter-category-' + category));
		if(servers !== null) return renderServers(servers);

		let data = await Utils.fetchServers('discord', page, 'category', category);
		renderServers(data);
		return;
	}

	let servers = JSON.parse(localStorage.getItem('servers-discord-' + page));
	if(servers !== null) return renderServers(servers);

	let data = await Utils.fetchServers('discord', page);
	renderServers(data);
}

if(server !== null){
	loadServerPage();
}else{
	loadServersPage();
}