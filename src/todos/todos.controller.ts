import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  UseInterceptors,
  UseFilters,
  Logger,
} from '@nestjs/common';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { TodosService } from './todos.service';
import { JwtAuthGuard } from '../auth/guard/jwt.guard';
import { ApiTags, ApiBearerAuth, ApiResponse, ApiBody } from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { HttpExceptionFilter } from '../filters/http-exception.filter';
import { CreateTodoDto, UpdateTodoDto } from './dto/create-todo.dto';

@ApiTags('todos')
@UseGuards(ThrottlerGuard)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@UseFilters(HttpExceptionFilter)
@Controller({ path: 'todos', version: '1' })
export class TodosController {
  private readonly logger = new Logger(TodosController.name);

  constructor(private readonly todosService: TodosService) {}

  @Post()
  @ApiBody({ type: CreateTodoDto })
  @ApiResponse({ status: 201, description: 'Todo created' })
  create(
    @Body() createTodoDto: CreateTodoDto,
    @Req() req: { user: { userId: number; username: string } },
  ) {
    this.logger.log(`Creating todo for user ${req.user.userId}`);
    return this.todosService.create(createTodoDto, req.user.userId);
  }

  @Get()
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({ status: 200, description: 'List of todos' })
  findAll(@Req() req: { user: { userId: number; username: string } }) {
    this.logger.log(`Fetching todos for user ${req.user.userId}`);
    return this.todosService.findAll(req.user.userId);
  }

  @Get(':id')
  @UseInterceptors(CacheInterceptor)
  @ApiResponse({ status: 200, description: 'Single todo' })
  findOne(
    @Param('id') id: string,
    @Req() req: { user: { userId: number; username: string } },
  ) {
    this.logger.log(`Fetching todo ${id} for user ${req.user.userId}`);
    return this.todosService.findOne(+id, req.user.userId);
  }

  @Patch(':id')
  @ApiBody({ type: UpdateTodoDto })
  @ApiResponse({ status: 200, description: 'Todo updated' })
  update(
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
    @Req() req: { user: { userId: number; username: string } },
  ) {
    this.logger.log(`Updating todo ${id} for user ${req.user.userId}`);
    return this.todosService.update(+id, updateTodoDto, req.user.userId);
  }

  @Delete(':id')
  @ApiResponse({ status: 200, description: 'Todo deleted' })
  remove(
    @Param('id') id: string,
    @Req() req: { user: { userId: number; username: string } },
  ) {
    this.logger.log(`Deleting todo ${id} for user ${req.user.userId}`);
    return this.todosService.remove(+id, req.user.userId);
  }
}
