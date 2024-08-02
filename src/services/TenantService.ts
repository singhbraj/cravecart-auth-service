import { Repository } from "typeorm"
import { ITenant } from "../types"
import { Tenant } from "../entity/Tenants"

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save({ ...tenantData })
    }

    async getAll() {
        return await this.tenantRepository.find()
    }

    async getById(id: number) {
        return await this.tenantRepository.findOne({
            where: { id },
        })
    }

    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData)
    }

    async deleteById(tenantId: number) {
        return await this.tenantRepository.delete(tenantId)
    }
}
