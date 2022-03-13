import { Body, Controller, Logger, Post, Request } from '@nestjs/common';

@Controller('wh')
export class WebhookController {
  private logger = new Logger(WebhookController.name);

  @Post('plaid')
  plaid(@Body() body: Record<string, unknown>, @Request() req: any) {
    this.logger.log(req.headers);
    this.logger.verbose(body);
  }
}
