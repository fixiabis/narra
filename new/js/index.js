var userId = Cookies.get("userId"),
	userName = Cookies.get("name"),
	solitaire = JSON.parse(Cookies.get("solitaire")),
	postTitle = document.querySelector("#article-title"),
	postName = document.querySelector("#article-name"),
	postContent = document.querySelector("#article-content"),
	postNote = document.querySelector("#article-note"),
	postRelate = document.querySelector("#article-relate"),
	postSent = document.querySelector("#article-sent"),
    postSolitaire = document.querySelector("#article-solitaire"),
    fbLogIO = document.querySelector("#facebook-logIO"),
	editUid = "",
	editFbid = "",
	editSerial = "";
if (userId) fbLogIO.innerHTML = "Logout the account";
if (userName) document.querySelector("#article-name").value = userName;
if (solitaire) postSolitaire.checked = solitaire;
postContent.value = localStorage.getItem("content");
fbLogIO.onclick = function () {
	if (!userId) {
		FB.login(function () {
			userId = FB.getUserID();
			Cookies.set("userId", userId);
			fbLogIO.innerHTML = "Logout the account";
		});
	} else {
		FB.logout(function () {
			userId = "";
			Cookies.del("userId");
			fbLogIO.innerHTML = "Login with Facebook";
		});
	}
};
document.querySelector("#post-article").onclick = function() {
	document.querySelector("[data-mode=post-article]").style.display = "";
}
document.querySelector("#article-id").oninput = function () {
	var id = this.value.replace("trianarra", "").replace("#", "");
	if (this.value.search("trianarra") > -1 && id != "" && !isNaN(id)) {
		id *= 1;
		editSerial.value = id;
		createCover();
		Promise.all([
			new Promise((resolve, reject) => requestData(id, "title", function (title) {
				postTitle.value = title; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "content", function (content) {
				postContent.value = content; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "name", function (name) {
				postName.value = name; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "relate", function (relate) {
				postRelate.value = relate; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "note", function (note) {
				postNote.value = note; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "id", function (fbid) {
				editFbid.value = fbid; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "uid", function (uid) {
				editUid.value = uid; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "type", function (type) {
				document.querySelector(`article-type [value=${type}]`);
				resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "solitaire", function (solitaire) {
				postSolitaire.checked = JSON.parse(solitaire);
				resolve();
			}))
		]).then(() => {
			document.querySelector("[data-mode=post-article]").style.display = "block";
			deleteCover();
		});
	}
}
document.querySelector("#article-cancel").onclick = function () {
	clearStory();
};
postRelate.onkeyup = function () {
	var id = this.value.replace("trianarra", "").replace("#", "");
	if (this.value.search("trianarra") > -1 && id != "" && !isNaN(id)) {
		new Promise((resolve, reject) => findUid(userId, function (uid) {
			new Promise((resolve, reject) => requestData(id, "solitaire", function (solitaire) {
				if (solitaire) resolve();
				else reject();
			})).catch(function () {
				new Promise((resolve, reject) => requestData(id, "uid", function (ruid) {
					if (uid != ruid) alert("本篇禁止他人接續");
				}));
			});
		}));
	}
};
document.querySelector("#article-sent").onclick = function () {
	var serial = editSerial.value,
		fbid = editFbid.value,
		uid = editUid.value,
		name = postName.value,
		type = document.querySelector("#article-type input:checked").value,
		title = postTitle.value,
		content = postContent.value,
		relate = postRelate.value,
		note = postNote.value,
		solitaire = postSolitaire.checked,
		sent = document.querySelector("#sent");
	createCover();
	if (name) Cookies.set("name", name);
	if (solitaire) Cookies.set("solitaire", solitaire);
	if (!userId) FB.login(function () {
		userId = FB.getUserID();
		Cookies.set("userId", userId);
		sent.click();
	});
	else if (document.querySelector("#edit-article").checked)
		storyEdit(userId, serial, fbid, type, title, content, relate, name, note, uid, solitaire);
	else storyPost(userId, name, type, title, content, relate, note, solitaire);
};
postContent.onkeyup = function () {
	localStorage.setItem("content", this.value);
}
window.onbeforeunload = function (event) {
	if (postContent.value.length) {
		event.returnValue = "\o/";
		return "\o/";
	}
}
function clearStory(ok) {
	if (ok || confirm("確定刪除?")) {
		postNote.value = "";
		postTitle.value = "";
		postContent.value = "";
		postRelate.value = "";
		localStorage.removeItem("content");
	}
}
function storyEdit(userId, serial, id, type, title, content, relate, name, note, uid, solitaire) {
	updateToFb(userId, serial, id, type, title, content, relate, name, note, uid, solitaire, function () {
		if (this.response.search("發送完成") > -1) {
			clearStory(1);
			if (confirm("是否開啟文章?"))
				window.open("https://facebook.com/" + this.response.replace("發送完成,id為", ""));
		} else alert(this.response);
		deleteCover();
	});
}
function createCover() {
	var cover = document.querySelector(".cover");
	if (cover) return;
	cover = document.createElement("div");
	cover.className = "cover";
	document.body.appendChild(cover);
}
function deleteCover() {
	var cover = document.querySelector(".cover");
	if (cover) document.body.removeChild(cover);
}
function storyPost(userId, name, type, title, content, relate, note, solitaire) {
	postToFb(userId, name, type, title, content, relate, note, solitaire, function () {
		if (this.response.search("發送完成") > -1) {
			clearStory(1);
			if (confirm("是否開啟文章?"))
				window.open("https://facebook.com/" + this.response.replace("發送完成,id為", ""));
		} else alert(this.response);
		deleteCover();
	});
}
function requestData(id, type, when_loaded) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "https://storee-cfab1.firebaseio.com/posts/" + id + "/" + type + ".json");
	xhr.onload = function () {
		when_loaded(JSON.parse(this.response));
	};
	xhr.send();
}
function findUid(id, when_loaded) {
	var xhr = new XMLHttpRequest();
	xhr.open("get", "https://storee-cfab1.firebaseio.com/users/" + id + ".json");
	xhr.onload = function () {
		when_loaded(JSON.parse(this.response));
	};
	xhr.send();
}