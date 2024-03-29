export default class Utils{

	static initialize(){
		this.clearOldData();

		let lastPage = localStorage.getItem('lastPage');
		if(lastPage !== null){
			localStorage.removeItem('lastPage');
			window.location.href = lastPage;
			return;
		}

		try{
			let logged = localStorage.getItem('logged');
			if(logged !== null){
				document.getElementById('login-nav').innerHTML = `
				<a href='panel.html' class='primaryButton px-3 py-2 rounded-md text-sm font-medium'>Panel</a>
				<a id='logout' href='#' class='tertiaryColor px-3 py-2 rounded-md text-sm font-medium'>Log out</a>`;
			}
		}catch{}

		let userToken = localStorage.getItem('userToken');
		if(userToken === null){
			localStorage.setItem('userToken', crypto.randomUUID().replaceAll('-', ''));
			localStorage.setItem('userToken-time', Date.now());
		}

		window.setInterval(function() {
			let logged = localStorage.getItem('logged');
			if(logged !== null){
				if((new Date(logged).getTime() + 3_600_000) < new Date().getTime()){
					localStorage.removeItem('token');
					localStorage.removeItem('logged');
					localStorage.removeItem('my-servers-minecraft');
					localStorage.removeItem('my-servers-discord');
					location.reload();
				}
			}
		}, 5000);
	}

	static clearOldData(){
		let keys = Object.keys(localStorage);
		for(let i = 0; i < keys.length; i++){
			let time = localStorage.getItem(keys[i] + '-time');
			if(time !== null && Number(time) + 60_000 < Date.now()){
				localStorage.removeItem(keys[i]);
				localStorage.removeItem(keys[i] + '-time');
			}
		}
	}

	static logout(reload = true){
		localStorage.removeItem('token');
		localStorage.removeItem('logged');
		localStorage.removeItem('my-servers-minecraft');
		localStorage.removeItem('my-servers-discord');
		if(reload) location.reload();
	}

	static requireAuthentication(){
		let logged = localStorage.getItem('logged');
		if(logged === null) window.location.href = 'login.html';
	}

	static async fetchServer(type, id){
		let req = await fetch("https://api.rabbitserverlist.com/v1/server/" + type + "/" + id);
		let data = await req.json();

		localStorage.setItem('server-' + type + '-' + id, JSON.stringify(data.data));
		localStorage.setItem('server-' + type +'-' + id + '-time', Date.now());

		return data.data;
	}

	static async fetchServerStats(type, id){
		let req = await fetch("https://api.rabbitserverlist.com/v1/server/" + type + "/" + id + "/stats");
		let data = await req.json();

		localStorage.setItem('server-' + type + '-' + id + '-stats', JSON.stringify(data.data));
		localStorage.setItem('server-' + type + '-' + id + '-stats-time', Date.now());

		return data.data;
	}

	static async fetchServers(type, page, filter = null, value = null){

		if(filter !== null && value !== null){
			let req = await fetch("https://api.rabbitserverlist.com/v1/servers/" + type + "/page/" + page + "/filter/" + filter + "/" + value);
			let data = await req.json();

			localStorage.setItem('servers-' + type + '-' + page + '-filter-' + filter + '-' + value, JSON.stringify(data.data));
			localStorage.setItem('servers-' + type + '-' + page + '-filter-' + filter + '-' + value + '-time', Date.now());

			return data.data;
		}

		let req = await fetch("https://api.rabbitserverlist.com/v1/servers/" + type + "/page/" + page);
		let data = await req.json();

		localStorage.setItem('servers-' + type + '-' + page, JSON.stringify(data.data));
		localStorage.setItem('servers-' + type + '-' + page + '-time', Date.now());

		return data.data;
	}

	static durationBetween(date, date2){
		const diffTime = Math.abs(date2 - date);
		const diffSeconds = Math.ceil(diffTime / (1000));
		const diffMinutes = Math.ceil(diffTime / (1000 * 60));
		const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if(diffSeconds < 60) return diffSeconds + ' second(s) ago';
		if(diffMinutes < 60) return diffMinutes + ' minute(s) ago';
		if(diffHours < 24) return diffHours + ' hour(s) ago';
		return diffDays + ' day(s) ago';
	}

	static fancyDate(date){
		if(typeof(date) === 'string') date = new Date(date);
		return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
	}

	static async copyToClipboard(text){
		await navigator.clipboard.writeText(text);
	}

	static isPositiveInteger(s) {
		return /^\+?[1-9][\d]*$/.test(s);
	}

	static rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
		const hex = x.toString(16);
		return hex.length === 1 ? '0' + hex : hex;
	}).join('');

	static toggleMenu(){
		if(document.getElementById("mobile-menu").className == 'hidden pt-2 pb-3 space-y-1'){
			document.getElementById("mobile-menu").className = 'pt-2 pb-3 space-y-1';
		}else{
			document.getElementById("mobile-menu").className = 'hidden pt-2 pb-3 space-y-1';
		}
	}

	static hide(element){
		document.getElementById(element).style.display = 'none';
	}

	static show(element, method = 'flex'){
		document.getElementById(element).style.display = method;
	}

	static showDialogButtons(){
		document.getElementById('dialog-button').style.display = "";
		document.getElementById('dialog-button-cancel').style.display = "";
	}

	static hideDialogButtons(){
		document.getElementById('dialog-button').style.display = "none";
		document.getElementById('dialog-button-cancel').style.display = "none";
	}

	static changeDialog(style, text){
		this.showDialogButtons();
		switch(style){
			case 0:
				//Success dialog
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

				document.getElementById('dialog-title').innerText = "SUCCESS";
				document.getElementById('dialog-text').innerText = text;

				document.getElementById('dialog-button-cancel').style.display = 'none';

				document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Okay';
				document.getElementById('dialog-button').onclick = () => this.hide("dialog");
			break;
			case 1:
				//Error dialog
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

				document.getElementById('dialog-title').innerText = "ERROR";
				document.getElementById('dialog-text').innerText = text;

				document.getElementById('dialog-button-cancel').style.display = 'none';

				document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Okay';
				document.getElementById('dialog-button').onclick = () => this.hide("dialog");
			break;
			case 2:
				//Loading...
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600 animate-spin' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M12 3a9 9 0 1 0 9 9'></path></svg>";

				document.getElementById('dialog-title').innerText = 'PLEASE WAIT';
				document.getElementById('dialog-text').innerHTML = text;

				this.hideDialogButtons();
			break;
			case 3:
				//Register dialog
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

				document.getElementById('dialog-title').innerText = "SUCCESS";
				document.getElementById('dialog-text').innerText = text;

				document.getElementById('dialog-button-cancel').style.display = 'none';

				document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Okay';
				document.getElementById('dialog-button').onclick = () => window.location.href = 'login.html';
			break;
			case 4:
				// Add Minecraft Server
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-blue-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'/><line x1='12' y1='5' x2='12' y2='19' /><line x1='5' y1='12' x2='19' y2='12' /></svg>";

				document.getElementById('dialog-title').innerText = "Add Minecraft Server";
				document.getElementById('dialog-text').innerHTML = ``;

				document.getElementById('dialog-button-cancel').style.display = 'initial';

				document.getElementById('dialog-button').className = "primaryButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Add';
				document.getElementById('dialog-button').onclick = () => this.hide("dialog");

				document.getElementById('dialog-button-cancel').onclick = () => this.hide("dialog");
			break;
			case 5:
				//Success dialog with reload
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

				document.getElementById('dialog-title').innerText = "SUCCESS";
				document.getElementById('dialog-text').innerText = text;

				document.getElementById('dialog-button-cancel').style.display = 'none';

				document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Okay';
				document.getElementById('dialog-button').onclick = () => location.reload();
			break;
			case 6:
				//Delete account dialog
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

				document.getElementById('dialog-title').innerText = 'Delete account';
				document.getElementById('dialog-text').innerText = 'Are you sure you want to delete your account? All of your data will be permanently removed. This action can NOT be undone.';

				document.getElementById('dialog-button-cancel').style.display = 'initial';

				document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Delete';
				document.getElementById('dialog-button').onclick = () => this.deleteAccount();

				document.getElementById('dialog-button-cancel').onclick = () => this.hide("dialog");
			break;
			case 7:
				//Delete server dialog
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' /></svg>";

				document.getElementById('dialog-title').innerText = 'Delete server';
				document.getElementById('dialog-text').innerText = 'Are you sure you want to delete this server? This action can NOT be undone.';

				document.getElementById('dialog-button-cancel').style.display = 'initial';

				document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Delete';
				document.getElementById('dialog-button').onclick = () => this.deleteServer(text['type'], text['id']);

				document.getElementById('dialog-button-cancel').onclick = () => this.hide("dialog");
			break;
			case 8:
				//Success dialog to panel redirect
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-green-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M5 13l4 4L19 7' /></svg>";

				document.getElementById('dialog-title').innerText = "SUCCESS";
				document.getElementById('dialog-text').innerText = text;

				document.getElementById('dialog-button-cancel').style.display = 'none';

				document.getElementById('dialog-button').className = "successButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Okay';
				document.getElementById('dialog-button').onclick = () => window.location.href = 'panel.html';
			break;
			case 9:
				//Already voted dialog
				document.getElementById('dialog-icon').className = "mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10";
				document.getElementById('dialog-icon').innerHTML = "<svg class='h-6 w-6 text-red-600' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'><path stroke='none' d='M0 0h24v24H0z' fill='none'></path><path d='M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0'></path><path d='M12 7v5l3 3'></path></svg>";

				document.getElementById('dialog-title').innerText = "You can't vote yet!";
				document.getElementById('dialog-text').innerText = text;

				document.getElementById('dialog-button-cancel').style.display = 'none';

				document.getElementById('dialog-button').className = "dangerButton inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 text-base font-medium focus:outline-none sm:w-auto sm:text-sm";
				document.getElementById('dialog-button').innerText = 'Okay';
				document.getElementById('dialog-button').onclick = () => this.hide("dialog");
			break;
		}
	}

	static deleteAccount(){
		this.changeDialog(2, 'Deleting account...');
		this.show('dialog');

		let headers = new Headers();
		headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
		headers.set('Content-Type', 'application/json');

		fetch('https://api.rabbitserverlist.com/v1/account', {
			method: 'DELETE',
			headers: headers
		}).then(result => {
			return result.json();
		}).then(response => {
			if(response.error !== 0){
				this.changeDialog(1, response.info);
				this.show('dialog');
				return;
			}

			this.logout();
		}).catch(() => {
			this.changeDialog(1, 'Something went wrong while trying to perform this action. Please try again later.');
			this.show('dialog');
		});
	}

	static deleteServer(type, id){
		this.changeDialog(2, 'Deleting server...');
		this.show('dialog');

		let headers = new Headers();
		headers.set('Authorization', 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('token')));
		headers.set('Content-Type', 'application/json');

		fetch('https://api.rabbitserverlist.com/v1/server/' + type + '/' + id, {
			method: 'DELETE',
			headers: headers
		}).then(result => {
			return result.json();
		}).then(response => {
			if(response.error !== 0){
				this.changeDialog(1, response.info);
				this.show('dialog');
				return;
			}

			localStorage.removeItem('my-servers-' + type);
			location.reload();
		}).catch(() => {
			this.changeDialog(1, 'Something went wrong while trying to perform this action. Please try again later.');
			this.show('dialog');
		});
	}

}