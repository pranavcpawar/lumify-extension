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
				}
			);
		}

		form.reset();
	});
