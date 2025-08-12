import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Todo } from './todo.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique ID' })
  id: number;

  @Column({ unique: true })
  @ApiProperty({ description: 'Username' })
  username: string;

  @Column()
  @ApiProperty({ description: 'Hashed password' })
  password: string;

  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];
}
