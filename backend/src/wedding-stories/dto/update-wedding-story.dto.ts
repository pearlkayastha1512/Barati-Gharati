import { PartialType } from '@nestjs/mapped-types';

import { CreateWeddingStoryDto } from './create-wedding-story.dto';

export class UpdateWeddingStoryDto extends PartialType(
  CreateWeddingStoryDto,
) {}