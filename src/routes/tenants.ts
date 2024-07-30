import express from "express"
import { TenantController } from "../controllers/TenantController"
import { Tenant } from "../entity/Tenants"
import { AppDataSource } from "../config/data-source"
import { TenantService } from "../services/TenantService"

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService)

router.post("/", (req, res, next) => tenantController.create(req, res, next))

export default router
