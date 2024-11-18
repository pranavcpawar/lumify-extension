function fillLumaForm() {
	const form = document.querySelector("form");
	const inputs = form.querySelectorAll(".luma-input:not(.has-indicator)");
	const labels = form.querySelectorAll(".lux-input-label");

	chrome.storage.local.get(null, function (data) {
		let fields = [];

		for (let key in data) {
			if (key.startsWith("ts_")) {
				fields.push({
					name: data[key].name,
					value: data[key].value,
				});
			}
		}

		console.log("saved data:", fields);

		for (let i = 0; i < inputs.length; i++) {
			const input = inputs[i];
			const label = input.id
				? form.querySelector(`label[for="${input.id}"]`)
				: labels[i];

			console.log("label:", label);
			const labelText = label.textContent.includes(" *")
				? label.textContent.split(" *")[0].replace("?", "")
				: label.textContent.replace("?", "");
			console.log("labelText:", labelText);

			for (const field of fields) {
				console.log("field:", field);
				const regex = Array.isArray(field.name)
					? new RegExp(`(?=.*\\b${field.name.join("\\b)(?=.*\\b")}\\b)`, "i")
					: new RegExp(`(?=.*\\b${field.name}\\b)`, "i");

				const isValid = regex.test(labelText);

				if (isValid) {
					console.log("match found:", field);
					input.value = field.value;
					input.dispatchEvent(new Event("input", { bubbles: true }));
					break;
				}
			}
		}
	});
}

function detectLumaForm() {
	const buttons = document.querySelectorAll("button");

	buttons.forEach((button) => {
		if (button.textContent.includes("Request to Join")) {
			button.addEventListener("click", function () {
				const observer = new MutationObserver(function (mutations) {
					const mutation = mutations[0];
					if (mutation.type === "childList") {
						const form = document.querySelector("form");
						if (form) {
							console.log("Form detected");
							fillLumaForm();
							observer.disconnect();
						}
					}
				});
				observer.observe(button, { childList: true, subtree: true });
			});
		}
	});
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	console.log("Received message:", request);
	try {
		if (request.action === "fillLumaForm") {
			fillLumaForm();
			sendResponse({ message: "Form filled" });
		}
	} catch (error) {
		console.error("Error:", error);
		sendResponse({ message: "Error" });
	}
	return true;
});

window.addEventListener("load", function () {
	detectLumaForm();
});
