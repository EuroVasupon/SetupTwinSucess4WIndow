
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
@Entity('admins')
export class AdminEntity {
  @PrimaryGeneratedColumn()
    id!: number;

  @Column('varchar', { nullable: true, name: 'username' })
    username!: string;

  @Column('varchar', { nullable: false, length: 100, name: 'firstname' })
    firstName!: string;

  @Column('varchar', { nullable: false, length: 100, name: 'lastname' })
    lastName!: string;
}
// @Entity('product')
// export class productEntity {
//   @PrimaryGeneratedColumn()
//     id!: number;

//   @Column('varchar', { nullable: true, name: 'name' })
//     name!: string;

//   @Column('integer', {nullable: false, name: 'price' })
//     price!: number;
    
// }