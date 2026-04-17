import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { PilotsService } from './pilots.service';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { CreatePilotoDto } from './dto/create-piloto.dto';
import { UpdatePilotoDto } from './dto/update-piloto.dto';

@Controller('pilots')
export class PilotsController {
  constructor(private readonly pilotsService: PilotsService) {}
    
  @Get()
    findAll() {
      return this.pilotsService.findAll();
    }
    
  @Get(':id')
    findOne(@Param('id') id: string) {
      return this.pilotsService.findOne(id);
    }
    
  @Post()
    create(@Body() createPilotDto: CreatePilotoDto) {
      return this.pilotsService.create(createPilotDto);
    }
    
  @Patch(':id')
    update(@Param('id') id: string, @Body() updatePilotDto: UpdatePilotoDto) {
      return this.pilotsService.update(id, updatePilotDto);
    }
    
  @Delete(':id')
    remove(@Param('id', ParseMongoIdPipe) id: string) {
      return this.pilotsService.remove(id);
    }
}
