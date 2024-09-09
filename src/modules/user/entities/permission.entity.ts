import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

@Entity({
  name: "permissions"
})
export class Permission {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 50,
    comment: "权限名"
  })
  permission_name: string;

  @Column({
    length: 50,
    comment: "权限编码"
  })
  permission_code: string;

  @Column({
    length: 50,
    comment: "权限描述"
  })
  permission_desc: string;

  @Column({
    default: false,
    comment: "是否删除"
  })
  is_deleted: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;
}
