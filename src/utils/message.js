const moment = require("moment");

const generateMessage = (from, text) => ({
    from,
    text,
    createdAt: moment(new Date().getTime()).format("h:mm"),
});

const generateLocationMessage = (from, lat, long) => ({
    from,
    url: `https://www.google.com/maps?q=${lat},${long}`,
    createdAt: moment(new Date().getTime()).format("h:mm"),
});

module.exports = {
    generateMessage,
    generateLocationMessage,
};