function renderData(fields) {
	const dashboard = document.querySelector(".dashboard__fields");
	console.log("dashboard:", dashboard);

	dashboard.innerHTML = "";

	for (const [index, field] of Object.entries(fields)) {
		console.log(`rendering field ${index}:`, field);
		const fieldElement = document.createElement("div");
		fieldElement.classList.add("dashboard__field");
		if (Array.isArray(field.name)) {
			fieldElement.innerHTML = `<div class="field__container"><div class="field__content"><span class="field__name">${field.name.join(
				" && "
			)}</span><span class="field__value">${
				field.value
			}</span></div><div class="field__actions"><img class="field__actions__button" src="/src/assets/edit.svg" alt="edit" /><img class="field__actions__button" src="/src/assets/delete.svg" alt="delete" /></div></div>`;
		} else {
			fieldElement.innerHTML = `<div class="field__container"><div class="field__content"><span class="field__name">${field.name}</span><span class="field__value">${field.value}</span></div><div class="field__actions"><img class="field__actions__button" src="/src/assets/edit.svg" alt="edit" /><img class="field__actions__button" src="/src/assets/delete.svg" alt="delete" /></div></div>`;
		}
		dashboard.appendChild(fieldElement);
	}
}

function loadData() {
	chrome.storage.local.get(null, function (data) {
		let fields = [];

		for (const key in data) {
			console.log("key:", key);
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
