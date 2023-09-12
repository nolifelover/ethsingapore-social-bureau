import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Query,
  Req,
} from '@nestjs/common';
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { VotesListDto } from './dto/get-vote.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/users/models/role.enum';

@Controller('votes')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @Auth(Role.INSPECTOR, Role.USER)
  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async createVote(@Body() createVoteDto: CreateVoteDto, @Req() req: any) {
    const body = { ...createVoteDto };
    if (req.user.uid) {
      body.createdBy = req.user.uid;
      body.point = req.user.power;
    }
    return this.voteService.createVote(body);
  }
  /** Frontend not use */
  @Get()
  async getVotes(@Query() query: VotesListDto) {
    const { crimeId, createdUserId, orderBy, page = 1, limit = 10 } = query;
    const filter = {};
    const order = {};

    if (crimeId) {
      Object.assign(filter, { crimeId });
    }
    if (createdUserId) {
      Object.assign(filter, { createdUserId });
    }
    if (orderBy) {
      const o = orderBy.split(':');
      Object.assign(order, { [o[0]]: o[1] });
    }

    const result = await this.voteService.getVotes(filter, order, Number(page), Number(limit));

    return result;
  }

  @Get(':id')
  async getVoid(@Param('id') id: string) {
    return this.voteService.getVote(id);
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  )
  async updateVote(@Param('id') id: string, @Body() updateVoteDto: UpdateVoteDto) {
    return this.voteService.updateVote(id, updateVoteDto);
  }

  @Delete(':id')
  async deleteVote(@Param('id') id: string) {
    return this.voteService.deleteVote(id);
  }
  /** Frontend not use */
}
