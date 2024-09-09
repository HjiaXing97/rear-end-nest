import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from "typeorm";
import { Role } from "./role.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({
    length: 50,
    comment: "用户名"
  })
  user_name: string;

  @Column({
    length: 50,
    comment: "密码"
  })
  password: string;

  @Column({
    length: 50,
    comment: "邮箱"
  })
  email: string;

  @Column({
    length: 50,
    comment: "手机号"
  })
  phone_number: string;

  @Column({
    length: 50,
    comment: "头像",
    nullable: true
  })
  head_pic: string;

  @Column({
    default: false,
    comment: "是否冻结"
  })
  is_frozen: boolean;

  @Column({
    default: false,
    comment: "是否删除"
  })
  is_deleted: boolean;

  @CreateDateColumn()
  create_time: Date;

  @UpdateDateColumn()
  update_time: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: "user_role"
  })
  roles: Role[];
}
