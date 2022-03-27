var get = window.location.search.substr(1).split("&");
var servers = ["minecraft"]; 

for(let i = 0; i < servers.length; i++){
  let jsonApp = localStorage.getItem(servers[i]);
  let jsonTime = localStorage.getItem(servers[i] + "-time");

  if(typeof(jsonApp) == 'undefined' || jsonApp == null){
    fetchData(servers[i]);
    continue;
  }
  if(typeof(jsonTime) == 'undefined' || jsonTime == null){
  	fetchData(servers[i]);
    continue;
  }
   
  try{
    JSON.parse(jsonApp);
  }catch (e){
    localStorage.setItem(servers[i], "{}");
    localStorage.setItem(servers[i] + "-time", 0);
    fetchData(servers[i]);
    continue;
  }

  if(Number(jsonTime) + 3600000 < Date.now()){
    fetchData(servers[i]);
    continue;
  }
}

function fetchData(type){

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "https://raw.githubusercontent.com/Rabbit-Company/RabbitServerList-Data/main/data/" + type + ".json");

  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");

  xhr.onreadystatechange = function () {

      if(xhr.readyState === 4){
          if(xhr.status != 200) return;
          try {
              JSON.parse(xhr.responseText);
              localStorage.setItem(type, xhr.responseText);
              localStorage.setItem(type + "-time", Date.now());
              location.reload();
          } catch (e) {
              localStorage.setItem(type, "{}");
              localStorage.setItem(type + "-time", 0);
          }
      }

  };
  xhr.send();
}

function isPositiveInteger(s) {
  return /^\+?[1-9][\d]*$/.test(s);
}

function isIDValid(servers, id){
  for(let i = 0; i < servers.length; i++) if(servers[i].id == id) return true;
  return false;
}

function getServerData(servers, id){
  for(let i = 0; i < servers.length; i++) if(servers[i].id == id) return servers[i];
  return null;
}