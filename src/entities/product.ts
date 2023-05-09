/* eslint-disable linebreak-style */

import { Entity, Column, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('product')
export class product {
  @PrimaryGeneratedColumn()
    Id!: number;

  @Column('varchar', { nullable: true, name: 'username' })
    Name!: string;

  @Column('integer', {nullable: false, name: 'price' })
    Price!: number;


    // @CreateDateColumn({ name: 'created_at' })
    // createdAt!: Date;
  
    // @UpdateDateColumn({ name: 'updated_at' })
    // updatedAt!: Date;
    // @DeleteDateColumn({ name: 'deleted_at' })
    // deletedAt?: Date;
}