import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { Permission } from "./permission.entity";

@Entity({
  name: "role"
})
export class Role {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 50,
    comment: "角色名"
  })
  role_name: string;

  @Column({
    length: 50,
    comment: "角色描述"
  })
  role_desc: string;

  @Column({
    default: false,
    comment: "是否删除"
  })
  is_deleted: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: "role_permission"
  })
  permission: Permission[];
}
