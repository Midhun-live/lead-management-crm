import { Router } from 'express';
import { createLead, getLeads, getLead, updateLead, deleteLead } from '../controllers/lead.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../validations/auth.validation';
import { createLeadSchema, updateLeadSchema, queryParamsSchema, validateUuidParam } from '../validations/lead.validation';

const router = Router();

router.use(authMiddleware);

router.post('/', validate(createLeadSchema), createLead);
router.get('/', validate(queryParamsSchema), getLeads);
router.get('/:id', validateUuidParam, getLead);
router.put('/:id', validateUuidParam, validate(updateLeadSchema), updateLead);
router.delete('/:id', validateUuidParam, deleteLead);

export default router;
