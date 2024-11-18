document
	.getElementById("add-data-form")
	.addEventListener("submit", function (e) {
		e.preventDefault();

		const form = document.getElementById("add-data-form");
		const button = document.querySelector("button[type='submit']");
		const formData = new FormData(form, button);

		const fieldName = formData.get("field-name").toString().includes(" && ")
			? formData.get("field-name").toString().split(" && ")
			: formData.get("field-name").toString();
		const fieldValue = formData.get("field-value").toString();

		if (fieldName && fieldValue) {
			const timestamp = Date.now();

			chrome.storage.local.set(
				{
					[`ts_${timestamp}`]: {
						name: fieldName,
						value: fieldValue,
					},
				},
				function () {
					console.log(`Field added ${fieldName}:${fieldValue}`);
					loadData();
				}
			);
		}

		form.reset();
	});

document.getElementById("add-lumify").addEventListener("click", function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(
			tabs[0].id,
			{ action: "fillLumaForm" },
			function (response) {
				console.log("Response from content script:", response);
			}
		);
	});
});

function renderData(data) {
	const container = document.querySelector(".fields__container");
	console.log("container:", container);

	container.innerHTML = "";

	let fields = [];
	if (data.length > 4) {
		fields = data.slice(0, 3);
	} else {
		fields = data;
	}

	for (const [index, field] of Object.entries(fields)) {
		console.log(`rendering field ${index}:`, field);
		const fieldElement = document.createElement("div");
		fieldElement.classList.add("fields__field");
		if (Array.isArray(field.name)) {
			fieldElement.innerHTML = `<span class="field__name">${field.name.join(
				" && "
			)}</span><span>${field.value}</span>`;
		} else {
			fieldElement.innerHTML = `<span class="field__name">${field.name}</span><span>${field.value}</span>`;
		}
		container.appendChild(fieldElement);
	}
}

function loadData() {
	chrome.storage.local.get(null, function (data) {
		let fields = [];

		for (const key in data) {
			if (key.startsWith("ts_")) {
				fields.push({
					name: data[key].name,
					value: data[key].value,
				});
			}
		}
		console.log("saved data:", fields);

		renderData(fields.reverse());
	});
}

document.addEventListener("DOMContentLoaded", loadData);
