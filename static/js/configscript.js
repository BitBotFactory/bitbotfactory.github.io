
var createCORSRequest = function(method, url) {
    // test-cors.org
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // Most browsers.
      xhr.open(method, url, true);
    } else if (typeof XDomainRequest != "undefined") {
      // IE8 & IE9
      xhr = new XDomainRequest();
      xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
};

var url = 'https://raw.githubusercontent.com/BitBotFactory/poloniexlendingbot/master/default.cfg.example';
var method = 'GET';
var xhr = createCORSRequest(method, url);
var defaultconfigtext = null;
var options = [];

function init() {
    xhr.onload = function() {
        defaultconfigtext = xhr.responseText;
        console.log("Default config loaded from GitHub successfully.");
        parseQuestions(defaultconfigtext);
    };

	xhr.onerror = function() {
	    console.log("Default config loading failed, require user config.");
        // TODO
	};
    xhr.send();
};

function printResponse() {
	console.log(defaultconfigtext);
};

function parseQuestions(rawconfig) {
    var lines = rawconfig.split('\n');
    var headers = [];
    var cats = {};
    var categories = {};
    for (x in lines) {
        if ((lines[x][0] === '[') & (lines[x][lines[x].length - 1] === ']')) {
            headers.push(x);
        }
    }
    for (i in headers) { // This purposefully skips the first section (before [API]) because it is not settings.
        index1 = parseInt(headers[i]);
        if (parseInt(i) + 1 !== headers.length) { index2 = parseInt(headers[parseInt(i) + 1]) - 1; } else { index2 = lines.length - 1}
        cats[lines[index1]] = lines.slice(index1 + 1, index2);
        categories[lines[index1]] = [];
    }
    for (cat in cats) {
        cats[cat] = cats[cat].join('\n').split('\n\n'); // Split each setting by a blank line.
        for (setting in cats[cat]) {
            var option_body = {'description':[],'setting':{}};
            option_lines = cats[cat][setting].split('\n');
            for (i in option_lines) {
                if (option_lines[i].indexOf('=') === -1) {
                    // Is a description line
                    option_body['description'].push(option_lines[i].slice(1));
                } else {
                    // Is a setting
                    option_body['setting'][option_lines[i].slice(0,option_lines[i].indexOf('=')).trim()] = option_lines[i].slice(option_lines[i].indexOf('=') + 1).trim();
                }
            categories[cat][setting] = option_body;
            }
        }
    }
    console.log(categories); // For testing
    return categories;
};

function buildElements(settings) { // Please help
        arrayLength = settings.length;

    for (i = 0; i < arrayLength; i++) {
      $('<div class="settings" />').text(settings[i]).appendTo('body');
    }
}
