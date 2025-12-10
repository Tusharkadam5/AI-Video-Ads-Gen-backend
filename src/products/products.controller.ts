import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a product' })
    create(@CurrentUser() user: any, @Body() dto: CreateProductDto) {
        return this.productsService.create(user.id, dto);
    }

    @Get()
    @ApiOperation({ summary: 'List user products' })
    findAll(@CurrentUser() user: any) {
        return this.productsService.findAll(user.id);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get product details' })
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }
}
