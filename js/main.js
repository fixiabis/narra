function getSearchValue(name) {
    var search = location.search.substr(1, location.search.length).split("&").map((val) => val.split("="));
    if (search.filter((val) => val[0] == name)[0])
        return search.filter((val) => val[0] == name)[0][1];
    else
        return null;
}
document.querySelector("header .title").addEventListener("click", function() {
    location = "index.html";
});