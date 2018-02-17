function createField(content, id) {
    var trinId = ""
    function contentFormat(content) {
        var match = content.match(/#trianarra.+ :|#trianarra.+ 之前|#trianarra.+ 之後/g),
            authorId = content.match(/#trianarra_.+\n/g)[0].replace("\n", "");
        if (match == null) return "";
        for (var i = 0; i < match.length; i++) {
            var statusMatch = match[i].match(/ 之前| 之後| :/g),
                replaceContent = match[i].replace(statusMatch[0], "");
            if (i == 0) trinId = replaceContent.replace("#trianarra", "");
            content = content.replace(match[i], `<a href="${replaceContent}">${replaceContent}</a>${statusMatch}`);
        }
        return content
            .replace("\n其他作品點此 : #trianarra_各篇開端", "")
            .replace(authorId, `<a href="${authorId}">${authorId}</a>\n`);
    }
    content = contentFormat(content);
    if (!content) return;
    var field = document.createElement("div"),
        contentContainer = document.createElement("div"),
        buttonContainer = document.createElement("div"),
        commentButton = document.createElement("input"),
        editButton = document.createElement("input");
    field.className = "field";
    contentContainer.innerHTML = content.replace(/\n/g, "<br/>");
    editButton.value = "編輯";
    editButton.type = "button";
    editButton.onclick = function () {
        window.open(`post.html?edit_id=${trinId}`);
    };
    commentButton.value = "留言";
    commentButton.type = "button";
    commentButton.onclick = function () {
        window.open("https://www.facebook.com/" + id);
    };
    buttonContainer.className = "button-container";
    buttonContainer.appendChild(commentButton);
    buttonContainer.appendChild(editButton);
    field.appendChild(contentContainer);
    field.appendChild(buttonContainer);
    document.querySelector(".container").insertBefore(
        field,
        document.querySelector(".field").nextSibling
    );
}
function getData(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url);
    xhr.onload = function () {
        var data = JSON.parse(this.response);
        callback(data);
    };
    xhr.send();
}
function getFbData() {
    var url = "https://graph.facebook.com/trianarra/feed?fields=from,message,comments&limit=10",
        token = "&access_token=EAAEAhFsvEQIBAFrTHXMYfZBleKjrTUZBZAmyUFyoeraXQxpc7NDZA1fna0ZAHV3PLh1ugec8OLPzgeiAL0FH7vZCoRWfZC1SZCUT9PVX9c10Ldl7PZBECIha4yS3uo9woQAhcVGUQPrn9GRihwp4Urkmmzj9v4CTxIZCbSXx2mDpoO4wZDZD",
        fetcher = function (data) {
            for (var i = 0; i < data.data.length; i++) {
                var d = data.data[i],
                    id = d.id,
                    message = d.message,
                    comments = d.comments;
                createField(message, id);
            }
            if (data.paging && data.paging.next)
                return getData(data.paging.next, fetcher);
            else {
                if (location.hash) contentFilter();
                if (location.search)
                    showField(decodeURI(getSearchValue("content")));
            }
        };
    getData(url + token, fetcher);
}
getFbData();
function showField(searchContent) {
    var fieldContent = document.querySelectorAll(".field div:first-child");
    for (var i = 0; i < fieldContent.length; i++) {
        fieldContent[i].parentNode.style.display =
            fieldContent[i].innerHTML.indexOf(searchContent) > -1 ? "" : "none";
    }
}
function contentFilter() {
    showField(location.hash);
}
function headerSwitch(open) {
    if (open == undefined)
        open = document.querySelector("header").style.height != "100px";
    document.querySelector("header").style.height = open ? "100px" : "";
}
window.addEventListener("hashchange", contentFilter);
document.querySelector(".searchButton").addEventListener("click", function() {
    headerSwitch();
});
window.addEventListener("resize", function() {
	if (document.body.clientWidth > 540)
		headerSwitch(false);
});