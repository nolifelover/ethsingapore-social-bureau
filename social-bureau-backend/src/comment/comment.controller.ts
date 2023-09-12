import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Req } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentsListDto } from './dto/get-comment.dto';
import { Auth } from 'src/auth/decorator/auth.decorator';
import { Role } from 'src/users/models/role.enum';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Auth(Role.INSPECTOR)
  @Post()
  async createComment(@Body() createCommentDto: CreateCommentDto, @Req() req: any) {
    const body = { ...createCommentDto };
    if (req.user.uid) {
      body.createdBy = req.user.uid;
    }
    return this.commentService.createComment(body);
  }

  @Get()
  async getComments(@Query() query: CommentsListDto) {
    const { orderBy, page = 1, limit = 10 } = query;
    const filter = {};
    const order = {};

    if (orderBy) {
      const o = orderBy.split(':');
      Object.assign(order, { [o[0]]: o[1] });
    }

    const result = await this.commentService.getComments(filter, order, Number(page), Number(limit));

    return result;
  }

  @Get(':id')
  async getComment(@Param('id') id: string) {
    return this.commentService.getComment(id);
  }

  @Patch(':id')
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto) {
    return this.commentService.updateComment(id, updateCommentDto);
  }

  @Auth(Role.INSPECTOR)
  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    return this.commentService.deleteComment(id);
  }
}
