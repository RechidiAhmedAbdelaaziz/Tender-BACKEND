import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Category } from 'src/models/category.entity';
import { SubCategory } from 'src/models/sub-category.dto';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryService } from './sub-category.service';

@Module({
  imports: [
    DatabaseModule.forFeature([Category, SubCategory]),
  ],
  controllers: [CategoryController, SubCategoryController],
  providers: [CategoryService, SubCategoryService],
})
export class CategoryModule { }
