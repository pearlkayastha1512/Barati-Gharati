import { IsInt, IsString, Min } from 'class-validator';

export class GalleryImageDto {
  @IsString()
  image: string;

  @IsInt()
  @Min(0)
  sortOrder: number;
}