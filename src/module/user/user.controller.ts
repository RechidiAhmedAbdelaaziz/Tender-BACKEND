import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpAuthGuard, Role } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/auth.decorator';
import { Types } from 'mongoose';
import { UpdateUserBodyDTO } from './dto/update-user.dto';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { ListUsersDto } from './dto/list-users.dto';
import { ApiResult } from 'src/core/types/api-response';
import { ApiBearerAuth } from '@nestjs/swagger';
import { IdParams } from 'src/core/shared/dtos/id-param.dto';

@Controller('user/me')
@UseGuards(HttpAuthGuard)
@ApiBearerAuth()
export class UserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Update my profile
   */
  @Patch()
  async updateUser(
    @Body() body: UpdateUserBodyDTO,
    @CurrentUser() userId: Types.ObjectId,
  ) {
    const { name, email, password, phone, accountType, expiryDate, industries, notificationSettings, role } = body;
    const user = await this.userService.updateUser(userId,
      { name, email, password, phone, accountType, expiryDate, industries, notificationSettings, role }
    );
    return { data: user };
  }

  /**
   * Get my profile
   */
  @Get()
  async getMe(@CurrentUser() userId: Types.ObjectId) {
    const user = await this.userService.findUser(userId);
    return { data: user };
  }

  /**
   * Delete my profile
   */
  @Delete()
  async deleteUser(@CurrentUser() userId: Types.ObjectId) {
    await this.userService.deleteUser(userId);
    return { message: 'User deleted' };
  }


}


@ApiBearerAuth()
@Controller('user')
@Role(UserRoles.ADMIN)
@UseGuards(HttpAuthGuard)
export class AdminUserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Get all users
   */
  @Get()
  async getAllUsers(
    @Query() query: ListUsersDto
  ): Promise<ApiResult> {
    const { page, limit, keyword, fields, sort, accountType, role } = query;

    const result = await this.userService.findAll({ keyword, fields, sort, accountType, role }, { page, limit });

    return { data: result };
  }

  /**
   * Delete a user
   */
  @Delete(':id')
  async deleteUser(@Param() params: IdParams) {
    const { id } = params;

    await this.userService.deleteUser(id);
    return
  }

}


