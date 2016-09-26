'use strict';
const machina = require('machina');

const traffic = new machina.fsm({
	initialize: function() {

	},
	namespace: 'traffic-light',
	initialState: 'uninitialized',
	states: {
		uninitialized: {
			"*": function() {
				this.deferUntilTransition();
				this.transition('green');
			}
		},
		green: {
			_onEnter: function() {
				this.timer = setTimeout(function() {
					this.handle('timeout');
				}.bind(this), 30000);
				this.emit('vehicles', {status: 'GREEN'});
			},
			timeout: 'green-interruptible',
			pedestrianWaiting: function() {
				this.deferUntilTransition('green-interruptible');
			},
			_onExit: function() {
				clearTimeout(this.timer);
			}
		},
		'green-interruptible': {
			pedestrianWaiting: 'yellow';
		},
		yellow: {
			_onEnter: function() {
				this.timer = setTimeout(function() {
					this.handle('timeout');
				}.bind(this), 5000);
				this.emit('vehicles', {status: 'YELLOW'});
			},
			timeout: 'red',
			_onExit: function() {
				clearTimeout(this.timer);
			}
		},
		red: {
			_onEnter: function() {
				this.timer = setTimeout(function() {
					this.handle('timeout');
				}.bind(this), 1000);
				this.emit('vehicles', {status: 'RED'});
			},
			_reset: 'green',
			_onExit: function() {
				clearTimeout(this.timer);
			}
		}
	},
	reset: function() {
		this.handle('_reset');
	},
	pedestrianWaiting: function() {
		this.handle('pedestrianWaiting');
	}
});
