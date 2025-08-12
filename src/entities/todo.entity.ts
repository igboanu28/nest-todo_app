import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique ID' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Todo title' })
  title: string;

  @Column({ nullable: true })
  @ApiProperty({ description: 'Todo description' })
  description?: string;

  @Column({ default: false })
  @ApiProperty({ description: 'Completion status' })
  completed: boolean;

  @ManyToOne(() => User, (user) => user.todos)
  user: User;
}
