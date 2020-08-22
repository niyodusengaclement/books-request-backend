import express from 'express';
import PastorController from '../controllers/pastorController';
import userAuth from '../middlewares/userAuth';
import GeneralController from '../controllers/GeneralController';

const router = express.Router();


router.post('/login', GeneralController.login);
router.post('/send-otp', PastorController.sendOtp);
router.post('/account-setup', userAuth.checkToken,  PastorController.setupAccount);
router.post('/create-command', userAuth.checkToken, PastorController.createCommand);
router.get('/church-command', userAuth.checkToken, PastorController.getCommandPerChurch);
router.get('/pastor-churches', userAuth.checkToken, PastorController.getChurchesPerPastor);
router.get('/find-books', userAuth.checkToken, GeneralController.findBooks);
router.get('/languages', userAuth.checkToken, GeneralController.getLanguage);
router.get('/districts-and-fields', userAuth.checkToken, GeneralController.findDistrictsAndFields);
router.get('/requests', userAuth.checkToken, GeneralController.findAllRequests);
router.get('/requests/:id', userAuth.checkToken, GeneralController.findSingleRequest);
router.get('/churches', userAuth.checkToken, GeneralController.findAllChurches);
router.get('/dashboard', userAuth.checkToken, GeneralController.dashboard);
router.route('/timetable')
  .post(userAuth.checkToken, GeneralController.startAndDeadline)
  .get(userAuth.checkToken, GeneralController.checkDeadline)
router.get('/years', userAuth.checkToken, GeneralController.findYears);
router.patch('/update/:id', userAuth.checkToken, GeneralController.updateSingleRequest);
router.patch('/deliver/:id', userAuth.checkToken, GeneralController.deliverBooks);
router.post('/add-book', userAuth.checkToken, GeneralController.addBook);
router.post('/upload-image', userAuth.checkToken, GeneralController.uploadImage);
router.post('/upload-pastors', userAuth.checkToken, PastorController.uploadPastors);
router.post('/add-single-pastor', userAuth.checkToken, PastorController.addSinglePastor);
router.get('/find-pastors', userAuth.checkToken, GeneralController.findPastors);
router.post('/upload-churches', userAuth.checkToken, PastorController.uploadChurches);
router.post('/add-single-church', userAuth.checkToken, PastorController.addSingleChurch);
router.get('/profile', userAuth.checkToken, GeneralController.getUserProfile);

export default router;
