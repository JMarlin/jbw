function Queue() {

    //Give new functions the partial() superpower
    if(!Function.prototype.partial) Function.prototype.partial = function() {

        var f = this;
        var partArgs = Array.prototype.slice.call(arguments);

        return function() {

            f.apply(null, partArgs.concat.apply(partArgs, arguments));
        };
    };

    var that = this;

    this.commands = [];

    this.push = function(val) {

        that.commands.push(val);
    };

    this.execute = function() {

        console.log('queue #' + that.qid + ' testing item #' + that.commands.length);
        
	if(that.commands.length) {

            console.log('executing');
            that.commands.shift()(that.execute);
        }
    };
}
