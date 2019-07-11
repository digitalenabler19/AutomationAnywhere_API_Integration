const noteRoutes = require('./note_routes');
module.exports = function(app,io) {
  noteRoutes(app,io);
  // Other route groups could go here, in the future
};