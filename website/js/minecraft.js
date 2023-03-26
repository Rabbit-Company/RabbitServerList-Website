import Utils from './utils.js';
import DOMPurify from 'dompurify';
import { marked } from 'marked';

Utils.initialize();

const parms = new URLSearchParams(window.location.search);

let page = (parms.get('page') !== null && Utils.isPositiveInteger(parms.get('page'))) ? parms.get('page') : 1;
if(page > 50) page = 50;

let server = (parms.get('server') !== null && Utils.isPositiveInteger(parms.get('server'))) ? parms.get('server') : null;

function renderServer(serverData){
	document.getElementById('servers').className = "hidden";
	document.getElementById('server').className = "";

	document.getElementById('server-title').innerText = serverData.name;

	let html = marked.parse(serverData.description, {
		gfm: true,
		breaks: true,
		sanitizer: DOMPurify.sanitize
	});

	document.getElementById('description').innerHTML = html;
}

function renderServers(servers){
	let data = "";

	for(let i = 0; i < servers.length; i++){
		let online = (servers[i].online === servers[i].updated) ? "Online" : "Offline";
		let online_color = (servers[i].online === servers[i].updated) ? "greenBadge" : "redBadge";
		let categories = servers[i].categories.split(',');

		data += "<tr>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + (i + 1) + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 whitespace-nowrap'><a href='?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += "<td class='text-center px-4 py-4 whitespace-nowrap text-sm text-gray-500'><a href='?server=" + servers[i].id + "'><img class='rounded-t-md w-full' src='https://api.rabbitserverlist.com/v1/server/minecraft/" + servers[i].id + "/banner' /></a><span class='w-full inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium " + online_color + "'><a href='#'>" + servers[i].ip + "</a></span></td>";
		data += "<td class='px-4 py-4'><div>";
		for(let j = 0; j < categories.length; j++) data += "<span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium grayBadge'>" + categories[j] + "</span>";
		data += "</div></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium blueBadge'>" + servers[i].version + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + online + "</span></td>";
		data += "</tr>";
	}

	document.getElementById("table_data").innerHTML = data;
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
	renderServer(data);
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