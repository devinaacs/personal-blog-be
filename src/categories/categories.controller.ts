import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";

import { Role } from "@/common/constants/roles";
import { Roles } from "@/common/decorators/roles.decorator";
import { JwtAuthGuard } from "@/common/guards/jwt-auth.guard";
import { RolesGuard } from "@/common/guards/roles.guard";

import { CategoriesService } from "./categories.service";
import { CategoryResponseDto } from "./dto/category-response.dto";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { CategoryRecord } from "./types/category-record";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categories: CategoriesService) {}

  @Get()
  @ApiOkResponse({ description: "All categories", type: [CategoryResponseDto] })
  async findAll(): Promise<CategoryRecord[]> {
    return this.categories.findAll();
  }

  @Get(":slug")
  @ApiOkResponse({ description: "Category by slug", type: CategoryResponseDto })
  async findOne(@Param("slug") slug: string): Promise<CategoryRecord> {
    const category = await this.categories.findBySlug(slug);

    if (!category) {
      throw new NotFoundException("Category not found");
    }

    return category;
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiCreatedResponse({
    description: "Category created. Admin only.",
    type: CategoryResponseDto,
  })
  async create(@Body() dto: CreateCategoryDto): Promise<CategoryRecord> {
    return this.categories.create(dto);
  }

  @Patch(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOkResponse({
    description: "Category updated. Admin only.",
    type: CategoryResponseDto,
  })
  async update(
    @Param("id") id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<CategoryRecord> {
    return this.categories.update(id, dto);
  }

  @Delete(":id")
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOkResponse({ description: "Category deleted. Admin only." })
  async remove(@Param("id") id: string): Promise<void> {
    await this.categories.delete(id);
  }
}
