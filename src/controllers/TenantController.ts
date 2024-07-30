import { CreateTenantRequest } from "../types"
import { TenantService } from "./../services/TenantService"
import { NextFunction, Response } from "express"

export class TenantController {
    constructor(private tenantService: TenantService) {}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body
        try {
            const tenant = await this.tenantService.create({ name, address })
            res.status(201).json({ id: tenant.id })
        } catch (err) {
            next(err)
        }
    }
}
