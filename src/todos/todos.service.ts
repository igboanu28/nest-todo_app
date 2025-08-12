import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../entities/todo.entity';
import { UsersService } from '../users/users.service';
import { CreateTodoDto, UpdateTodoDto } from './dto/create-todo.dto';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private todosRepository: Repository<Todo>,
    private usersService: UsersService,
  ) {}

  findAll(userId: number): Promise<Todo[]> {
    return this.todosRepository.find({ where: { user: { id: userId } } });
  }

  async findOne(id: number, userId: number): Promise<Todo> {
    const todo = await this.todosRepository.findOne({
      where: { id, user: { id: userId } },
    });
    if (!todo) throw new NotFoundException('Todo not found');
    return todo;
  }

  async create(createTodoDto: CreateTodoDto, userId: number): Promise<Todo> {
    const user = await this.usersService.findOneById(userId);
    if (!user) throw new NotFoundException('User not found');

    const todo = this.todosRepository.create({
      ...createTodoDto,
      user,
    });
    return this.todosRepository.save(todo);
  }

  async update(
    id: number,
    updateTodoDto: UpdateTodoDto,
    userId: number,
  ): Promise<Todo> {
    await this.findOne(id, userId);
    await this.todosRepository.update(id, updateTodoDto);
    return this.findOne(id, userId);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.findOne(id, userId);
    await this.todosRepository.delete(id);
  }
}
