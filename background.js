chrome.runtime.onInstalled.addListener(function () {
	chrome.tabs.create({ url: "/src/welcome/index.html" });
	console.log("Extension installed");
});
