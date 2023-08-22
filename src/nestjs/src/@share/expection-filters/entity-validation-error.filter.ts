
import { EntityValidationError } from '@fc/micro-videos/dist/@seedwork/domain';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { union } from 'lodash'

@Catch(EntityValidationError)
export class EntityValidationErrorFilter implements ExceptionFilter {
  catch(exception: EntityValidationError, host: ArgumentsHost) {
    console.log('exception', exception)
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()

    response.status(422).json({
      statusCode: 422,
      error: 'Unprocessable Entity',
      message: union(...Object.values(exception.error))
    })
  }
}
