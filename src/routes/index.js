import express from 'express';
import PastorController from '../controllers/pastorController';
import userAuth from '../middlewares/userAuth';
import GeneralController from '../controllers/GeneralController';

const router = express.Router();

router.post('/login', GeneralController.login);
router.post('/send-otp', PastorController.sendOtp);
router.post('/account-setup', userAuth.checkToken,  GeneralController.setupAccount);
router.post('/create-command', userAuth.checkToken, PastorController.createCommand);
router.get('/church-command', userAuth.checkToken, PastorController.getCommandPerChurch);
router.get('/pastor-churches', userAuth.checkToken, PastorController.getChurchesPerPastor);
router.get('/find-books', userAuth.checkToken, GeneralController.findBooks);
router.get('/languageS', userAuth.checkToken, GeneralController.getLanguage);

export default router;
