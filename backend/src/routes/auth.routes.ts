
import { Router } from 'express';
import { checkEmailController, loginController, logoutController, refreshTokenController, registerUserController, subdomaincheckController, subdomainLoginController } from '../controllers/auth.controller';
import { authenticateJWT } from '../shared/auth.utils';

const routes = Router();

routes.post('/register', registerUserController);
routes.get('/:email', checkEmailController);
routes.post('/login',loginController);
routes.post('/subdomain', subdomainLoginController);
routes.post('/refresh-token',refreshTokenController);
routes.post('/logout',logoutController);

export default routes;