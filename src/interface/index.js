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
			}</span></div><div class="field__actions"><img id="edit-${
				field.ts
			}" class="field__actions__button" src="/src/assets/edit.svg" alt="edit" /><img id="delete-${
				field.ts
			}" class="field__actions__button" src="/src/assets/delete.svg" alt="delete" /></div></div>`;
		} else {
			fieldElement.innerHTML = `<div class="field__container"><div class="field__content"><span class="field__name">${field.name}</span><span class="field__value">${field.value}</span></div><div class="field__actions"><img id="edit-${field.ts}" class="field__actions__button" src="/src/assets/edit.svg" alt="edit" /><img id="delete-${field.ts}" class="field__actions__button" src="/src/assets/delete.svg" alt="delete" /></div></div>`;
		}
		dashboard.appendChild(fieldElement);
	}
}

function actions() {
	const buttons = document.querySelectorAll(".field__actions__button");
	console.log("buttons:", buttons);

	for (const button of buttons) {
		button.addEventListener("click", function () {
			console.log("button:", button);
			if (button.id.startsWith("delete-")) {
				const ts = button.id.split("-")[1];
				console.log("ts:", ts);
				chrome.storage.local.remove(ts, function () {
					console.log("removed");
					loadData();
				});
			}
		});
	}
}

function loadData() {
	chrome.storage.local.get(null, function (data) {
		let fields = [];

		for (const key in data) {
			console.log("key:", key);
			if (key.startsWith("ts_")) {
				fields.push({
					ts: key,
					name: data[key].name,
					value: data[key].value,
				});
			}
		}
		console.log("saved data:", fields);

		renderData(fields.reverse());
		actions();
	});
}

document.addEventListener("DOMContentLoaded", loadData);
