/**
 * Created by jaune on 16/02/14.
 */

var ListenerList = function () {
};

ListenerList.prototype = Object.create(Array.prototype);

ListenerList.prototype.dispatch = function () {
    var i, l;

    for (i = 0, l = this.length; i<l; i++) {
        this[i].apply(null, arguments);
    }
};