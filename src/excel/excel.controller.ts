import { Controller, Get, Res } from '@nestjs/common';
import { ExcelService } from './excel.service';
import { Context } from 'koa';
import { Public } from 'src/public-strategy';

@Controller('excel')
export class ExcelController {
  constructor(private readonly excelService: ExcelService) {}

  /**
   * Endpoint to export data to an Excel file
   * @param ctx The Koa context (response object)
   */
  @Public()
  @Get()
  async exportExcel(@Res() ctx: Context) {
    await this.excelService.exportExcel(ctx);
  }
}
