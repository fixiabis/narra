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
	fbLogIOButton = document.querySelectorAll(".facebook-logIO"),
	editUid = "",
	editFbid = "",
	editSerial = "";
if (userId) {
	fbLogIOButton[0].innerHTML = "Logout the account";
	fbLogIOButton[1].innerHTML = "登出";
}
if (userName) document.querySelector("#article-name").value = userName;
if (solitaire) postSolitaire.checked = solitaire;
postContent.value = localStorage.getItem("content");
function fbLogIO() {
	if (!userId) {
		FB.login(function () {
			userId = FB.getUserID();
			Cookies.set("userId", userId);
			fbLogIOButton[0].innerHTML = "Logout the account";
			fbLogIOButton[1].innerHTML = "登出";
		});
	} else {
		Cookies.del("userId");
		Cookies.del("name");
		clearStory(true);
		try {
			FB.logout(function () {
				userId = "";
				fbLogIOButton[0].innerHTML = "Login with Facebook";
				fbLogIOButton[1].innerHTML = "登入";
			});
		} catch (e) { }
	}
}
for (var i = 0; i < fbLogIOButton.length; i++)
	fbLogIOButton[i].onclick = fbLogIO;
document.querySelector("#post-article").addEventListener("click", function () {
	document.querySelector("[data-mode=post-article]").style.display = "";
});
document.querySelector("#article-id").addEventListener("input", findArticle);
document.querySelector("#article-cancel").addEventListener("click", function () {
	clearStory();
});
postRelate.addEventListener("input", function () {
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
});
document.querySelector("#article-sent").addEventListener("click", function () {
	var serial = editSerial,
		fbid = editFbid,
		uid = editUid,
		name = postName.value,
		type = document.querySelector("#article-type input:checked").value,
		title = postTitle.value,
		content = postContent.value,
		relate = postRelate.value,
		note = postNote.value,
		solitaire = postSolitaire.checked,
		sent = document.querySelector("#article-sent");
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
});
postContent.addEventListener("input", function () {
	localStorage.setItem("content", this.value);
});
window.addEventListener("beforeunload", function (event) {
	if (postContent.value.length) {
		event.returnValue = "\o/";
		return "\o/";
	}
});
document.querySelector("[for=post-article]").addEventListener("click", function() {
	clearStory(true);
});
function findArticle() {
	var id = this.value.replace("trianarra", "").replace("#", "");
	if (this.value.search("trianarra") > -1 && id != "" && !isNaN(id)) {
		id *= 1;
		editSerial = id;
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
				editFbid = fbid; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "uid", function (uid) {
				editUid = uid; resolve();
			})),
			new Promise((resolve, reject) => requestData(id, "type", function (type) {
				document.querySelector(`#article-type [value=${type}]`).checked = true;
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
var editId = getSearchValue("edit_id");
if (editId) {
	document.querySelector("#edit-article").click();
	document.querySelector("#article-id").value = `trianarra${editId}`;
	findArticle.bind(document.querySelector("#article-id"))();
}