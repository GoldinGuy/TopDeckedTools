import { Injectable, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import * as Color from "color";
import { Storage } from "@ionic/storage";

@Injectable({
	providedIn: "root"
})
export class ThemeService {
	constructor(
		@Inject(DOCUMENT) private document: Document,
		private storage: Storage
	) {
		storage.get("theme").then(cssText => {
			this.setGlobalCSS(cssText);
		});
	}

	// Override all global variables with a new theme
	setTheme(theme) {
		const cssText = CSSTextGenerator(theme);
		this.setGlobalCSS(cssText);
		this.storage.set("theme", cssText);
	}

	// Define a single CSS variable
	setVariable(name, value) {
		this.document.documentElement.style.setProperty(name, value);
	}

	private setGlobalCSS(css: string) {
		this.document.documentElement.style.cssText = css;
	}

	get storedTheme() {
		return this.storage.get("theme");
	}
}

const defaults = {
	primary: "#ffffff",
	secondary: "#fafafa",
	danger: "#5E548E",
	light: "#1b1e28",
	sliderColor: "#ffffff",
	colorIcon: "#CCCBDA",
	colorIconText: "#7F7E96",
	category: "#ffffff",
	listBackgroundColor: "#ffffff",
	backgroundColor: "#fafafa",
	toobarBackground: "#ffffff",
	toobarButton: "#AAB2B7",
	toobarText: "#FFFFFF"
};

function CSSTextGenerator(colors) {
	colors = { ...defaults, ...colors };

	const {
		primary,
		secondary,
		danger,
		light,
		sliderColor,
		colorIcon,
		colorIconText,
		category,
		listBackgroundColor,
		backgroundColor,
		toobarBackground,
		toobarButton,
		toobarText
	} = colors;

	return `
    --mystic-primary: ${primary};
    --mystic-secondary: ${secondary};
    --mystic-danger: ${danger};
    --mystic-light: ${light};
    --mystic-sliderColor: ${sliderColor};
    --mystic-colorIcon: ${colorIcon};
    --mystic-colorIconText: ${colorIconText};
    --mystic-category: ${category};
    --mystic-listBackgroundColor: ${listBackgroundColor};
    --mystic-backgroundColor: ${backgroundColor};
    --mystic-toobarBackground: ${toobarBackground};
    --mystic-toobarButton: ${toobarButton};
    --mystic-toobarText: ${toobarText};
  `;
}
