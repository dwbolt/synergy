/*

main class of a synergy web site

*/

class appClass {

constructor() {  // appClass - client side
	this.urlParams  = new URLSearchParams( window.location.search );

	this.proxy      = new proxyClass();
	this.calendar   = new calendarClass("weeks");
	this.format     = new formatClass();  // format time and dates
	this.login      = new loginClass();

	this.widgetList;    // will hold instance of widgetListClass
	this.css;           // var to hold json css file
}


async main() { // appClass - client side
  //debugger;
	const page = this.urlParams.get('p'); // page to load
	if (page === null) {
		// show home page of events
		const newURL  = encodeURI(`${window.location.pathname}`);
		const newURLs = newURL.split('/');
		const lastToken = newURLs[newURLs.length-1].toLowerCase();
		if (lastToken === ""        ) { window.location.href = newURL+"app.html?p=home"; }
		if (lastToken === "app.html") { window.location.href = newURL+"?p=home"        ; }
		return; // will never get here 
	}

	this.css                                        = await app.proxy.getJSON("css.json");
	document.getElementById("footer"    ).innerHTML = await app.proxy.getText("footer.html");

	if (this.login.getStatus()) {
		// user logged in
		document.getElementById("navigation").innerHTML = await app.proxy.getText("menuUser.html") 
		document.getElementById("userName").innerHTML = `Home for: ${sessionStorage.nameFirst} ${sessionStorage.nameLast}`
	} else {
		// user not logged in
		document.getElementById("navigation").innerHTML = await app.proxy.getText("menu.html")
	}

	// load data for page
	this.widgetList = new widgetListClass("main");
	this.widgetList.setJSON( await this.getPage(`${page}/_.json`) ); // add system or user path;

	// see if list or node is to be displayed
	const list      = this.urlParams.get('l');
	const node      = this.urlParams.get('n');
	const domButton = document.getElementById(this.urlParams.get('b'));    // see if button is being dispalyed

	if (list) {
		// display the nodes in list
		await this.widgetList.displayList(list);
	} else if (node) {
		await this.widgetList.displayNode(node);
	} else if (domButton) {
		// named button is there
		await this.widgetList.displayButton(domButton);
	} else if (document.getElementById('buttons').firstChild){
		// display first button
		await this.widgetList.displayButton( document.getElementById('buttons').firstChild);
	} else {
		// no button, assume rows has an array of nodes to display
		await this.widgetList.displayList("rows");
	}
}


async getPage(  // appClass - client side
	page  // get user page if they request it and they are loggedin
) {
	let url;
	// get page from user area if u is in the URL
	if (this.urlParams.get('u') != null) {
		url = `/users/myWeb/${page}`
	} else {
		// user SFC general page
		url = `synergyData/${page}`;
	}

	return await app.proxy.getJSON(url);
}


display( // appClass - client side
	// called from json buttons
	dom
){

	// goto url that will have the current button selected
	const urlParams = new URLSearchParams( window.location.search );
	let page="";
	if   (urlParams.get('p') != null) {
		let u="";
		if (urlParams.get('u') != null) {
			u="&u=" + urlParams.get('u');
		}
		page =  "p=" +urlParams.get('p') +u+ "&";
	}

	window.location.href = encodeURI(`${window.location.origin}/app.html?${page}b=${dom.id}`);
}


buttonURL() {  // appClass - client side
	this.widgetList.buttonURL();
}


} // end appClass
