import { Injectable } from '@nestjs/common';

import { Client } from '../../domain/entities/client.entity';
import { ClientTypeOrmEntity } from '../entities/client.typeorm-entity';

@Injectable()
export class ClientMapper {
  toDomain(entity: ClientTypeOrmEntity): Client {
    return new Client(
      entity.name,
      entity.email,
      entity.phone || '',
      entity.company || '',
      entity.industry || '',
      entity.id,
      entity.status,
      Number(entity.ltv),
      Number(entity.cac),
      Number(entity.mrr),
      entity.contractStart || null,
      entity.contractEnd || null,
      entity.npsScore || null,
      entity.csatScore || null,
      entity.notes || '',
      entity.createdAt,
      entity.updatedAt,
      entity.deletedAt || null,
    );
  }

  toPersistence(domain: Client): ClientTypeOrmEntity {
    const entity = new ClientTypeOrmEntity();
    entity.id = domain.getId();
    entity.name = domain.getName();
    entity.email = domain.getEmail();
    entity.phone = domain.getPhone() || undefined;
    entity.company = domain.getCompany() || undefined;
    entity.industry = domain.getIndustry() || undefined;
    entity.status = domain.getStatus();
    entity.ltv = domain.getLtv();
    entity.cac = domain.getCac();
    entity.mrr = domain.getMrr();
    entity.contractStart = domain.getContractStart() || undefined;
    entity.contractEnd = domain.getContractEnd() || undefined;
    entity.npsScore = domain.getNpsScore() || undefined;
    entity.csatScore = domain.getCsatScore() || undefined;
    entity.notes = domain.getNotes() || undefined;
    entity.createdAt = domain.getCreatedAt();
    entity.updatedAt = domain.getUpdatedAt();
    entity.deletedAt = domain.getDeletedAt() || undefined;
    return entity;
  }
}
