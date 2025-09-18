import { IsString, IsNotEmpty, MaxLength, IsMongoId } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId({ message: 'Invalid receiver ID' })
  @IsNotEmpty()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1000, { message: 'Message cannot exceed 1000 characters' })
  content: string;
}
