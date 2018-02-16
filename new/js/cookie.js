var Cookies = {
    set: function (name, value, expire) {
        var date = new Date();
        date.setTime(date.getTime() + expire * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + value + ";expires=" + date.toGMTString();
    },
    get: function (name) {
        var cookie = document.cookie.split("; ");
        for (var i = 0; i < cookie.length; i++) {
            var data = cookie[i].split("=");
            if (data[0] == name) return data[1];
        }
        return null;
    },
    del: function (name) {
        var date = new Date();
        date.setTime(0);
        document.cookie = name + "=;expires=" + date.toGMTString();
    }
};