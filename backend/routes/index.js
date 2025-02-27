const taskRouter = require('./task.route');
const userRouter = require('./user.route');
const statusRouter = require('./status.route');

module.exports = (app) => {
    app.use('/api/tasks', taskRouter);
    app.use('/api/users', userRouter);
    app.use('/api/status', statusRouter);
};