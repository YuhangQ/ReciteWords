const invodb = require("invodb");

let sub = invodb.collection("submission");
if(!sub.exist()) sub.create();

module.exports = sub;