import { BadRequestException } from '@nestjs/common';

export const imageFileFilter = (
  req: any,
  file: Express.Multer.File,
  callback: Function,
) => {

  if (
    !file.mimetype.match(
      /^image\/(jpeg|jpg|png|webp)$/
    )
  ) {
    return callback(
      new BadRequestException(
        'Only JPG, JPEG, PNG and WEBP files are allowed',
      ),
      false,
    );
  }

  callback(null, true);
};