import express, { NextFunction, Response } from "express"
import { TenantController } from "../controllers/TenantController"
import { Tenant } from "../entity/Tenants"
import { AppDataSource } from "../config/data-source"
import { TenantService } from "../services/TenantService"
import logger from "../config/logger"
import authenticate from "../middleware/authenticate"
import { canAccess } from "../middleware/canAccess"
import { Roles } from "../constants"
import tenantValidator from "../validators/tenant-validator"
import { CreateTenantRequest } from "../types"

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)

const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService, logger)

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
)

export default router
