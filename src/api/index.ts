import { Router } from 'express';
import auth from './routes/auth';
import user from './routes/user';
import agendash from './routes/agendash';
import dineTable from './routes/dineTable';
import admin from './routes/admin';
import manager from './routes/manager';
import customer from './routes/customer';

import customerOtp from './routes/customerOtp';
// guaranteed to get dependencies
export default () => {
	const app = Router();
	auth(app);
	user(app);
	agendash(app);
	dineTable(app);
	customerOtp(app);
	admin(app)
	manager(app)
	customer(app)

	return app
}