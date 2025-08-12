import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTodoDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Todo title' })
  title: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Todo description', required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Completion status', required: false })
  completed?: boolean;
}

export class UpdateTodoDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Todo title', required: false })
  title?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Todo description', required: false })
  description?: string;

  @IsBoolean()
  @IsOptional()
  @ApiProperty({ description: 'Completion status', required: false })
  completed?: boolean;
}
