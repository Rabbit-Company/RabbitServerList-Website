export default class Utils{

	static clearOldData(){
		let keys = Object.keys(localStorage);
		for(let i = 0; i < keys.length; i++){
			let time = localStorage.getItem(keys[i] + '-time');
			if(time !== null && Number(time) + 1_800_000 < Date.now()){
				localStorage.removeItem(keys[i]);
				localStorage.removeItem(keys[i] + '-time');
			}
		}
	}

	static async fetchServer(type, id){
		let req = await fetch("https://api.rabbitserverlist.com/v1/server/" + type + "/" + id);
		let data = await req.json();

		localStorage.setItem('server-minecraft-' + id, JSON.stringify(data.data));
		localStorage.setItem('server-minecraft-' + id + '-time', Date.now());

		return data.data;
	}

	static async fetchServers(type, page){
		let req = await fetch("https://api.rabbitserverlist.com/v1/servers/" + type + "/page/" + page);
		let data = await req.json();

		localStorage.setItem('servers-minecraft-' + page, JSON.stringify(data.data));
		localStorage.setItem('servers-minecraft-' + page + '-time', Date.now());

		return data.data;
	}

	static isPositiveInteger(s) {
		return /^\+?[1-9][\d]*$/.test(s);
	}

	static toggleMenu(){
		if(document.getElementById("mobile-menu").className == 'hidden pt-2 pb-3 space-y-1'){
			document.getElementById("mobile-menu").className = 'pt-2 pb-3 space-y-1';
		}else{
			document.getElementById("mobile-menu").className = 'hidden pt-2 pb-3 space-y-1';
		}
	}

	static fhide(element){
		document.getElementById(element).style.display = 'none';
	}

	static fshow(element, method = 'block'){
		document.getElementById(element).style.display = method;
	}

	static hide(element){
		document.getElementById(element).style.visibility = 'hidden';
	}

	static show(element){
		document.getElementById(element).style.visibility = 'visible';
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
		}
	}

}