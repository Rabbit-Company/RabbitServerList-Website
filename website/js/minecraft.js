const parms = new URLSearchParams(window.location.search);

let page = (parms.get('page') !== null && isPositiveInteger(parms.get('page'))) ? parms.get('page') : 1;
if(page > 50) page = 50;

let server = (parms.get('server') !== null && isPositiveInteger(parms.get('server'))) ? parms.get('server') : null;
let serverData = localStorage.getItem('server-minecraft-' + server);

if(server !== null && serverData === null){
	await fetchServer('minecraft', server);
}

let servers = JSON.parse(localStorage.getItem('servers-minecraft-' + page));
if(server === null && servers === null){
	await fetchServers('minecraft', page);
}

if(server !== null){
	document.getElementById('servers').className = "hidden";
	document.getElementById('server').className = "";
	document.getElementById("test").innerText = serverData;
}else{
	let table = document.getElementById("table_data");
	let data = "";

	for(let i = 0; i < servers.length; i++){
		let online = (servers[i].online) ? "Online" : "Offline";
		let online_color = (servers[i].online) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
		let categories = servers[i].categories.split(',');

		data += "<tr>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800'>" + (i + 1) + "</span></td>";
		data += "<td class='tertiaryColor px-4 py-4 whitespace-nowrap'><a href='minecraft.html?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap text-sm text-gray-500' style='text-align: center;'><img class='rounded-t-md w-full' src='https://cdn.rabbitserverlist.com/servers/minecraft/banners/" + servers[i].id + "' onerror=\"this.src='images/nobanner.png'\" /><span class='inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium " + online_color + "' style='width: 100%;'><a href='#'>" + servers[i].ip + "</a></span></td>";
		data += "<td class='px-4 py-4'><div>";
		for(let j = 0; j < categories.length; j++) data += "<span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium bg-gray-100 text-gray-800'>" + categories[j] + "</span>";
		data += "</div></td><td class='tertiaryColor px-4 py-4 whitespace-nowrap'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800'>" + servers[i].version + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + online + "</span></td>";
		data += "</tr>";
	}

	table.innerHTML = data;
}

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
	toggleMenu();
});