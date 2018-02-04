function postToFb(userId, name, type, title, content, relate, note, solitaire, when_get_response) {
	relate = relate.replace(/#/g, "");
	var xhr = new XMLHttpRequest(),
		url = "https://script.google.com/macros/s/AKfycbwACNTFS5N9GtpEQV1rGAnx7RG7yfHVE9Bkf-vva8ubwA-JJR4/exec?";
	url += "userId=" + userId + "&";
	url += "name=" + encode(name) + "&";
	url += "type=" + type + "&";
	url += "title=" + encode(title) + "&";
	url += "relate=" + encode(relate) + "&";
	url += "solitaire=" + solitaire + "&";
	url += "note=" + encode(note);
	xhr.open("post", url);
	xhr.onload = when_get_response;
	xhr.send(content);
}
function updateToFb(usereId, serial, id, type, title, content, relate, name, note, uid, solitaire, when_get_response) {
	relate = relate.replace(/#/g, "");
	var xhr = new XMLHttpRequest(),
		url = "https://script.google.com/macros/s/AKfycbwN4qaMjQuaFV0mqGjeVAGl1ucZOO1lm3TrbEqhbz4-KL82Cwk/exec?";
	url += "userId=" + userId + "&";
	url += "serial=" + serial + "&";
	url += "uid=" + uid + "&";
	url += "id=" + id + "&";
	url += "name=" + encode(name) + "&";
	url += "type=" + type + "&";
	url += "title=" + encode(title) + "&";
	url += "relate=" + encode(relate) + "&";
	url += "solitaire=" + solitaire + "&";
	url += "note=" + encode(note);
	console.log(url);
	xhr.open("post", url);
	xhr.onload = when_get_response;
	xhr.send(content);
	console.log(xhr)
}
function encode(r) {
	r = r.replace(/;/g, "%3B");
	r = r.replace(/\//g, "%2F");
	r = r.replace(/\?/g, "%3F");
	r = r.replace(/:/g, "%3A");
	r = r.replace(/@/g, "%4O");
	r = r.replace(/=/g, "%3D");
	r = r.replace(/&/g, "%26");
	r = r.replace(/</g, "%3C");
	r = r.replace(/>/g, "%3E");
	r = r.replace(/\"/g, "%22");
	r = r.replace(/#/g, "%23");
	r = r.replace(/\+/g, "%2B");
	r = r.replace(/%/g, "%25");
	r = r.replace(/{/g, "%7B");
	r = r.replace(/}/g, "%7D");
	r = r.replace(/\|/g, "%7C");
	r = r.replace(/\\/g, "%5C");
	r = r.replace(/\^/g, "%5E");
	r = r.replace(/~/g, "%7E");
	r = r.replace(/\[/g, "%5B");
	r = r.replace(/\]/g, "%5D");
	r = r.replace(/`/g, "%60");
	r = r.replace(/ /g, "%20");
	return r;
}
function getFromFb() {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "https://graph.facebook.com/Trianarra/feed?fields=id&access_token=EAAEAhFsvEQIBANJZBV6yRLBLME1QF9YFDv4WzA0VNOKNXLwhfPAPuDPYC1ODFkipscHp27ilCrvAtOowyvDA6JadKc9VZCGDyDXDST8w3zuA1r4Tvs1eI1TL29B9gKHqeQLlVQMpMT6KtPV5ZBZA8jRmPeKV7k32r7AOabkBAQZDZD");
	xhr.onload = function () {

	};
	xhr.send();
}