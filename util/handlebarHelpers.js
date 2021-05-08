module.exports = {
    ifEquals: function(a, b, options){
        if (a === b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    ifNotEquals: function(a, b, options){
        if (a !== b) {
            return options.fn(this);
        }
        return options.inverse(this);
    },
    sum: function(a, b){
        return a + b;
    }
}