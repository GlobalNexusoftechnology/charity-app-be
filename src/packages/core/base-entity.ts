import { Column } from 'typeorm';

export class UserBaseEntity {
  @Column({ type: 'uuid' })
  created_by?: string;

  @Column({ type: 'bigint' })
  created_on?: number;

  @Column({ type: 'uuid' })
  modified_by?: string;

  @Column({ type: 'bigint' })
  modified_on?: number;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;
}

export class UserBaseModifiedEntity extends UserBaseEntity {}
