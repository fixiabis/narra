var loadCount = 0;
function createField(content, id) {
    if (!content) return;
    var trinId = "",
        authorId = "",
        searchContent = "";
    function contentFormat(content) {
        if (!content) return "";
        var match = content.match(/#trianarra.+ :|#trianarra.+ 之前|#trianarra.+ 之後/g);
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
    if (location.search) {
        searchContent = decodeURI(getSearchValue("content"));
        if (searchContent)
            if (content.search(searchContent) < 0)
                content = "";
            else
                content = content.replace(new RegExp(searchContent, "g"), `<span class="search-content">${searchContent}</span>`);
    }
    content = contentFormat(content);
    if (!content) return;
    var field = document.createElement("div"),
        contentContainer = document.createElement("div"),
        buttonContainer = document.createElement("div"),
        commentButton = document.createElement("input"),
        editButton = document.createElement("input"),
        relateButton = document.createElement("input");
    field.className = "field";
    field.setAttribute("data-search", `trianarra${trinId} ${authorId.replace("#", "")}`);
    contentContainer.innerHTML = content.replace(/\n/g, "<br/>");
    editButton.value = "編輯";
    editButton.type = "button";
    editButton.onclick = function () {
        window.open(`post.html?edit_id=${trinId}`);
    };
    relateButton.value = "接續";
    relateButton.type = "button";
    relateButton.onclick = function () {
        window.open(`post.html?relate_id=${trinId}`);
    };
    commentButton.value = "留言";
    commentButton.type = "button";
    commentButton.onclick = function () {
        window.open("https://www.facebook.com/" + id);
    };
    buttonContainer.className = "button-container";
    buttonContainer.appendChild(commentButton);
    buttonContainer.appendChild(editButton);
    buttonContainer.appendChild(relateButton);
    field.appendChild(contentContainer);
    field.appendChild(buttonContainer);
    document.querySelector(".container").insertBefore(
        field,
        document.querySelector(".loading").parentNode
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
    var url = "https://graph.facebook.com/trianarra/feed?fields=from,message&limit=10",
        token = "&access_token=EAAEAhFsvEQIBAFrTHXMYfZBleKjrTUZBZAmyUFyoeraXQxpc7NDZA1fna0ZAHV3PLh1ugec8OLPzgeiAL0FH7vZCoRWfZC1SZCUT9PVX9c10Ldl7PZBECIha4yS3uo9woQAhcVGUQPrn9GRihwp4Urkmmzj9v4CTxIZCbSXx2mDpoO4wZDZD",
        fetcher = function (data) {
            for (var i = 0; i < data.data.length; i++) {
                var d = data.data[i],
                    id = d.id,
                    message = d.message;
                createField(message, id);
            }
            document.querySelector(".loading").innerHTML = `正在載入...(已讀取${loadCount}篇)`;
            if (data.paging && data.paging.next)
                return getData(data.paging.next, fetcher);
            else {
                document.querySelector(".loading").parentNode.style.display = "none";
                if (location.hash)
                    contentFilter();
            }
        };
    getData(url + token, fetcher);
}
function contentFilter() {
    var showFieldRule = `[data-search~=${location.hash.replace("#", "")}]`,
        showField = document.querySelectorAll(showFieldRule),
        hideField = document.querySelectorAll(`.field:not(${showFieldRule})`);
    for (var i = 1; i < hideField.length; i++)
        hideField[i].style.display = "none";
    for (var i = 0; i < showField.length; i++)
        showField[i].style.display = "";
    console.log(showField);
}
function headerSwitch(open) {
    if (open == undefined)
        open = document.querySelector("header").style.height != "100px";
    document.querySelector("header").style.height = open ? "100px" : "";
}
window.addEventListener("hashchange", contentFilter);
document.querySelector(".searchButton").addEventListener("click", function () {
    headerSwitch();
});
window.addEventListener("resize", function () {
    if (document.body.clientWidth > 540)
        headerSwitch(false);
});