import { Router } from 'express'
import {
  setupMfa,
  confirmMfa,
  verifyMfa,
  disableMfa,
  getMfaStatus
} from '../controllers/mfa.controller'
import { requireAuth } from '../middleware/requireAuth';
import { requireMfa } from '../middleware/RequireMfa';
import { requireFirebaseAuth } from '../middleware/requireFibaseAuth';

const router = Router()

router.post('/mfa/setup', requireFirebaseAuth, setupMfa);
router.post('/mfa/confirm', requireFirebaseAuth, confirmMfa);

//login
router.post('/mfa/verify', verifyMfa)

//perfil
router.get('/mfa/status', requireAuth, getMfaStatus)
router.post('/mfa/disable', requireAuth, requireMfa, disableMfa)


export default router
