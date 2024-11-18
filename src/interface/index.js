function renderData(fields) {
	const dashboard = document.querySelector(".dashboard");
	console.log("dashboard:", dashboard);

	dashboard.innerHTML = "";

	for (const [index, field] of Object.entries(fields)) {
		console.log(`rendering field ${index}:`, field);
		const fieldElement = document.createElement("div");
		fieldElement.classList.add("dashboard__field");
		if (Array.isArray(field.name)) {
			fieldElement.innerHTML = `<span class="field__name">${field.name.join(
				" && "
			)}</span><span>${field.value}</span>`;
		} else {
			fieldElement.innerHTML = `<span class="field__name">${field.name}</span><span>${field.value}</span>`;
		}
		dashboard.appendChild(fieldElement);
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
