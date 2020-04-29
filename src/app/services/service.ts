import { HttpClient } from "@angular/common/http";
import { ConfigData } from "./config";

export abstract class Service {
	constructor(public http: HttpClient, public path: String) {}

	getRootUrl() {
		return `${ConfigData.rootUrl}${this.path}`;
	}

	getItemList(
		filter = null,
		orderBy = null,
		order = null,
		page = null,
		perPage = null
	) {
		let query = "";
		let filterData = filter ? filter : "";
		let orderByData = orderBy ? `orderby=${orderBy}` : "";
		let orderData = order ? `order=${order}` : "";

		if (filterData) {
			query += `?${filterData}`;
		}

		if (orderByData) {
			if (query) {
				query += `&${filterData}`;
			} else {
				query += `?${filterData}`;
			}
		}

		if (orderData) {
			if (query) {
				query += `&${order}`;
			} else {
				query += `?${order}`;
			}
		}

		if (page) {
			if (query) {
				query += `&page=${page}`;
			} else {
				query += `?page=${page}`;
			}
		}

		if (perPage) {
			if (query) {
				query += `&per_page=${perPage}`;
			} else {
				query += `?per_page=${perPage}`;
			}
		}

		if (query) {
			query += `&timestepm=${new Date().getTime()}`;
		} else {
			query += `?timestepm=${new Date().getTime()}`;
		}
		let url = `${this.getRootUrl()}${query}`;
		console.log(url);
		return this.http.get(url);
	}

	getItemById(itemId) {
		return this.http.get(`${this.getRootUrl()}/${itemId}`);
	}
}
