let geth = get[0].split("=");
var servers;

try{
	servers = JSON.parse(localStorage.getItem("minecraft"))['servers'];
}catch(err){
	location.reload();
}

if(geth[0] == 'server' && isPositiveInteger(geth[1]) && isIDValid(servers, geth[1])){
	document.getElementById('servers').className = "hidden";
	document.getElementById('server').className = "";
	let data = getServerData(servers, geth[1]);
	document.getElementById("test").innerText = JSON.stringify(data);
}else{
	let table = document.getElementById("table_data");
	let data = "";

	for(let i = 0; i < servers.length; i++){
		let online = (servers[i].online) ? "Online" : "Offline";
		let online_color = (servers[i].online) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
		let banner = (servers[i].banner == null) ? 'images/nobanner.png' : servers[i].banner;

		data += "<tr>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-green-100 text-green-800'>" + (i + 1) + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><a href='minecraft.html?server=" + servers[i].id + "'>" + servers[i].name + "</a></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap text-sm text-gray-500' style='text-align: center;'><img class='rounded-t-md' style='min-width: 200px; max-height: 70px;' src='" + banner + "' onerror=\"this.src='images/nobanner.png'\" /><span class='inline-flex items-center px-2.5 py-0.5 text-sm rounded-b-md font-medium " + online_color + "' style='width: 100%;'><a href='#'>" + servers[i].ip + "</a></span></td>";
		data += "<td class='px-4 py-4'><div>";
		for(let j = 0; j < servers[i].categories.length; j++) data += "<span class='inline-flex items-center px-2 py-0.5 m-1 rounded text-xs font-medium bg-gray-100 text-gray-800'>" + servers[i].categories[j] + "</span>";
		data += "</div></td><td class='px-4 py-4 whitespace-nowrap'>" + servers[i].players + " / " + servers[i].players_max + "</td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-100 text-blue-800'>" + servers[i].version + "</span></td>";
		data += "<td class='px-4 py-4 whitespace-nowrap'><span class='inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium " + online_color + "'>" + online + "</span></td>";
		data += "</tr>";
	}

	table.innerHTML = data;
}

document.getElementById("menu-toggle-btn").addEventListener('click', () => {
  toggleMenu();
});