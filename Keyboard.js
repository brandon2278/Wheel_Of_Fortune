var lastKey = null;

const Keyboard = {
	elements: {
		main: null,
		keysContainer: null,
		keys: []
	},

	eventHandlers: {
		oninput: null,
		onclose: null
	},
	
	properties: {
		value: "",
		capsLock: false
	},

	init() {
		this.elements.main = document.createElement("div");
		this.elements.keysContainer = document.createElement("div");
		
		this.elements.main.classList.add("mikmaqKeyboard", "mikmaqKeyboard--hidden");
		this.elements.keysContainer.classList.add("mikmaqKeyboardKeys");
		this.elements.keysContainer.appendChild(this._createKeys());
		
		this.elements.keys = this.elements.keysContainer.querySelectorAll('.mikmaqKeyboardKey');
		
		this.elements.main.appendChild(this.elements.keysContainer);
		document.body.appendChild(this.elements.main);
	},
	
	_createKeys() {
		const fragment = document.createDocumentFragment();
		const keyLayout = [
			"caps", "á", "é", "í", "ɨ", "ó", "ú", "backspace",
			"close", "space"
		];

		const createIcon = (icon_name) => {
			return `<i class="material-icons">${icon_name}</i>`;
		};

		keyLayout.forEach(key => {
			const keyElement = document.createElement('button');
			const breakLine = ['backspace'].indexOf(key) !== -1;
			

			keyElement.setAttribute("type", "button");
			keyElement.classList.add("mikmaqKeyboardKey")

			if (key == "backspace") {
				keyElement.classList.add("mikmaqKeyboardKey--wide");
				keyElement.innerHTML = createIcon("backspace");

				keyElement.addEventListener("click", () => {
					lastKey = "backspace";
					this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
					this._triggerEvent("oninput");
				});
			}
			else if (key == "caps") {
				keyElement.classList.add("mikmaqKeyboardKey--wide", "mikmaqKeyboardKey--activatable");
				keyElement.innerHTML = createIcon("keyboard_capslock");

				keyElement.addEventListener("click", () => {
					lastKey = "caps";
					this._toggleCaps();
					keyElement.classList.toggle("mikmaqKeyboardKey--active", this.properties.capsLock);
				});
			}
			else if (key == "space") {
				keyElement.classList.add("mikmaqKeyboardKey--extraWide");
				keyElement.innerHTML = createIcon("space_bar");

				keyElement.addEventListener("click", () => {
					lastKey = "space";
					this.properties.value += " ";
					this._triggerEvent("oninput");
				});
			} 
			else if (key == "close") {
				keyElement.classList.add("mikmaqKeyboardKey--wide", "mikmaqKeyboardKey--dark");
				keyElement.innerHTML = createIcon("check_circle");

				keyElement.addEventListener("click", () => {
					lastKey = "close";
					this.close();
					this._triggerEvent("onclose");
				});
			} else {
				keyElement.textContent = key.toLowerCase();

				keyElement.addEventListener("click", () => {
					lastKey = this.properties.value;
					this.properties.value += this.properties.capsLock ? key.toUpperCase() : key.toLowerCase();
					this._triggerEvent("oninput");
				});
			}

			fragment.append(keyElement);
			if (breakLine) {
				fragment.appendChild(document.createElement("br"));
			}
		});

		return fragment;
	},

	_triggerEvent(handlerName) {
		if (typeof this.eventHandlers[handlerName] == "function") {
			this.eventHandlers[handlerName](this.properties.value);
		}
	},

	_toggleCaps() {
		this.properties.capsLock = !this.properties.capsLock;

		for (let key of this.elements.keys) {
			if (key.childElementCount === 0) {
				key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
			}
		}
	},

	open(initalValue, oninput, onclose) {
		this.properties.value = initalValue || "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
		this.elements.main.classList.remove("mikmaqKeyboard--hidden");
	},
	
	close() {
		this.properties.value = "";
		this.eventHandlers.oninput = oninput;
		this.eventHandlers.onclose = onclose;
		this.elements.main.classList.add("mikmaqKeyboard--hidden");
	}
};

window.addEventListener("DOMContentLoaded", function() {
	Keyboard.init();
	document.querySelectorAll(".useLobbyKeyboard").forEach(element => {
		element.addEventListener("focus", () => {
			Keyboard.open("", currentValue => {
			element.select();
			let next = currentValue.substr(currentValue.length - 1);
			console.log(lastKey);
			if (lastKey !== "backspace") element.value += next;
			else element.value = element.value.slice(0, -1);
			})
		});
	});

	document.querySelectorAll(".useGameKeyboard").forEach(element => {
		element.addEventListener("focus", () => {
			Keyboard.open("", currentValue => {
			element.select();
			let next = currentValue.substr(currentValue.length - 1);
			if (element.getAttribute("maxlength") > element.value.length) {
				if (lastKey !== "backspace") element.value += next;
				else element.value = element.value.slice(0, -1);
			}
			else if (lastKey === "backspace") element.value = element.value.slice(0, -1);
			})
		});
	});
});

