import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UsePipes,
  ValidationPipe,
  Req,
  Headers,
} from '@nestjs/common';
import { CrimeService } from './crime.service';
import { CreateCrimeDto } from './dto/create-crime.dto';
import { UpdateCrimeDto } from './dto/update-crime.dto';
import { CrimesListByScamTypeDto, CrimesListDto } from './dto/get-crime.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/users/models/role.enum';

@Controller('crimes')
export class CrimeController {
  constructor(private readonly crimeService: CrimeService) {}
  @Auth(Role.INSPECTOR, Role.USER)
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async createCrime(@Body() createCrimeDto: CreateCrimeDto, @Req() req: any) {
    const body = { ...createCrimeDto };
    if (req.user.uid) {
      body.createdBy = req.user.uid;
    }
    return this.crimeService.createCrime(body);
  }

  @Get()
  async getCrimes(@Query() query: CrimesListDto, @Headers() headers: any) {
    const { name, cId, mobilePhone, bank, walletAddress, orderBy, page = 1, limit = 10 } = query;
    const filter = {};
    const order = {};

    if (name) {
      Object.assign(filter, { name });
    }
    if (cId) {
      Object.assign(filter, { cId });
    }
    if (mobilePhone) {
      Object.assign(filter, { mobilePhone });
    }
    if (bank) {
      Object.assign(filter, { 'paymentDetail.bank': bank });
    }
    if (walletAddress) {
      Object.assign(filter, { 'paymentDetail.walletAddress': walletAddress });
    }
    if (orderBy) {
      const o = orderBy.split(':');
      Object.assign(order, { [o[0]]: o[1] });
    }
    let userId = '';
    if (headers.userid) {
      userId = headers.userid;
    }
    const result = await this.crimeService.getCrimes(filter, order, Number(page), Number(limit), userId);

    return result;
  }

  @Get('/scam-type')
  async getCrimesByScamType(@Query() query: CrimesListByScamTypeDto, @Headers() headers: any) {
    const { scamType, orderBy, page = 1, limit = 10 } = query;
    const filter = {};
    const order = {};

    if (scamType) {
      const scamTypeArray = scamType.split(',');
      Object.assign(filter, { scamType:  scamTypeArray});
    }
    if (orderBy) {
      const o = orderBy.split(':');
      Object.assign(order, { [o[0]]: o[1] });
    }
    let userId = '';
    if (headers.userid) {
      userId = headers.userid;
    }
    const result = await this.crimeService.getCrimesByScamType(filter, order, Number(page), Number(limit), userId);

    return result;
  }

  @Get(':id')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  async getCrime(@Param('id') id: string, @Headers() headers: any) {
    let userId = '';
    if (headers.userid) {
      userId = headers.userid;
    }
    return this.crimeService.getCrime(id, userId);
  }
  @Auth(Role.INSPECTOR, Role.USER)
  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async updateCrime(@Param('id') id: string, @Body() updateCrimeDto: UpdateCrimeDto) {
    return this.crimeService.updateCrime(id, updateCrimeDto);
  }
  @Auth(Role.INSPECTOR, Role.USER)
  @Delete(':id')
  async deleteCrime(@Param('id') id: string) {
    return this.crimeService.deleteCrime(id);
  }
}
