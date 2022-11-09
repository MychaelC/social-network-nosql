const Moment = require('moment');

module.exports = (timestamp) => {
    const date = new Moment(timestamp);

    return date.format('MMMM Do YYYY, h:mm:ss a');
};