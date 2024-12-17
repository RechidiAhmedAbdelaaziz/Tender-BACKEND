import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { HttpAuthGuard, SetRole } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/auth.decorator';
import { Types } from 'mongoose';
import { UpdateUserBodyDTO } from './dto/update-user.dto';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { ListUsersDto } from './dto/list-users.dto';
import { ApiResponse } from 'src/core/types/api-response';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UserIdParamDto } from './dto/userid-param.dto';

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
    const { name, email, password, phone } = body;
    const user = await this.userService.updateUser(userId, { name, email, password, phone });
    return ApiResponse.success({ data: user });
  }

  /**
   * Get my profile
   */
  @Get()
  async getMe(@CurrentUser() userId: Types.ObjectId) {
    const user = await this.userService.findUser(userId);
    return ApiResponse.success({ data: user });
  }

  /**
   * Delete my profile
   */
  @Delete()
  async deleteUser(@CurrentUser() userId: Types.ObjectId) {
    await this.userService.deleteUser(userId);
    return ApiResponse.success({ message: 'User deleted successfully' });
  }


}


@ApiBearerAuth()
@Controller('user')
@UseGuards(HttpAuthGuard)
@SetRole(UserRoles.ADMIN)
export class AdminUserController {
  constructor(private readonly userService: UserService) { }

  /**
   * Get all users
   */
  @Get()
  async getAllUsers(
    @Query() query: ListUsersDto
  ) {
    const { page, limit, keyword, fields, sort } = query;
    const result = await this.userService.findAll({ keyword, fields, sort }, { page, limit });
    return ApiResponse.success(result);
  }

  /**
   * Delete a user
   */
  @Delete(':userId')
  async deleteUser(@Param() params: UserIdParamDto) {
    const { userId } = params;

    await this.userService.deleteUser(new Types.ObjectId(userId));
    return ApiResponse.success({ message: 'User deleted successfully' });
  }

}


