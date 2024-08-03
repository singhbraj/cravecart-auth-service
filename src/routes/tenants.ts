import express, { NextFunction, Request, Response } from "express"
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

router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
)

router.get("/", (req: Request, res: Response, next: NextFunction) =>
    tenantController.getAll(req, res, next),
)

router.get(
    "/:id",
    authenticate,
    (req: Request, res: Response, next: NextFunction) =>
        tenantController.getOne(req, res, next),
)

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
)

export default router
