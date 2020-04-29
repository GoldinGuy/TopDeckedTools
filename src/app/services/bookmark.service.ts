import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';

@Injectable({ providedIn: 'root' })
export class BookmarkService {
    constructor(private file:File) {}

    save(post) {
        if (!post) {
            return;
        }
        if (!post.id) {
            return;
        }

        let bookmarkList = this.getAllBookmark();
        if (bookmarkList[post.id]) {
            return;
        } else {
            bookmarkList[post.id] = post;
            localStorage.setItem('bookmark', JSON.stringify(bookmarkList));
        }
    }   
    
    clearAll() {
        localStorage.removeItem("bookmark");
    }

    delete(post) {
        if (!post) {
            return;
        }
        if (!post.id) {
            return;
        }
        let bookmarkList = this.getAllBookmark();
        if (bookmarkList[post.id]) {
            delete bookmarkList[post.id]
            localStorage.setItem('bookmark', JSON.stringify(bookmarkList));
        }
    }

    getAllBookmark() {
        let bookmarkListString = localStorage.getItem('bookmark');
        if (!bookmarkListString) {
            return {};
        } else {
            return JSON.parse(bookmarkListString);
        }
    }

    getSettingsObject() {
        let result =  {
            'bookmark': localStorage.getItem('bookmark'),
            'isPushNotificationEnabled': localStorage.getItem('isPushNotificationEnabled'),
            'isLightColorSelected': localStorage.getItem('isLightColorSelected')       
        };
        return JSON.stringify(result);
    }

    writeToFile() {
        console.log('writeToFile');
        this.file.writeFile(this.file.externalRootDirectory, 'settings.json', this.getSettingsObject(), {replace: true});
    }

    readFromFile() {
        console.log('readFile');
        return this.file.readAsText(this.file.externalRootDirectory, 'settings.json');
    }
}