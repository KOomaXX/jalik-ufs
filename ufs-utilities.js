import {Meteor} from 'meteor/meteor';
import {_} from 'meteor/underscore';


if (Meteor.isClient) {

    /**
     * Returns file and data as ArrayBuffer for each files in the event
     * @deprecated
     * @param event
     * @param callback
     */
    // todo remove deprecated method
    UploadFS.readAsArrayBuffer = (event, callback) => {
        console.error('UploadFS.readAsArrayBuffer is deprecated, see https://github.com/jalik/jalik-ufs#uploading-from-a-file');
    };

    /**
     * Opens a dialog to select a single file
     * @param callback
     */
    UploadFS.selectFile = (callback) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = false;
        input.onchange = (ev) => {
            let files = ev.target.files;
            callback.call(UploadFS, files[0]);
        };
        // Fix for iOS
        input.style = 'display:none';
        document.body.appendChild(input);
        input.click();
    };

    /**
     * Opens a dialog to select multiple files
     * @param callback
     */
    UploadFS.selectFiles = (callback) => {
        let input = document.createElement('input');
        input.type = 'file';
        input.multiple = true;
        input.onchange = (ev) => {
            let files = ev.target.files;

            for (let i = 0; i < files.length; i += 1) {
                callback.call(UploadFS, files[i]);
            }
        };
        // Fix for iOS
        input.style = 'display:none';
        document.body.appendChild(input);
        input.click();
    };
}


if (Meteor.isServer) {

    /**
     * Adds the path attribute to files
     * @param where
     */
    UploadFS.addPathAttributeToFiles = (where)=> {
        _.each(UploadFS.getStores(), (store)=> {
            let files = store.getCollection();

            // By default update only files with no path set
            files.find(where || {path: null}, {fields: {_id: 1}}).forEach((file)=> {
                let path = store.getFileRelativeURL(file._id);
                files.update({_id: file._id}, {$set: {path: path}});
            });
        });
    };
}
