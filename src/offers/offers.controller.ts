import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Logger,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto, UpdateOfferDto } from './dto/create-offer.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../users/schemas/user.schema';

@Controller('offers')
export class OffersController {
  private readonly logger = new Logger(OffersController.name);

  constructor(private readonly offersService: OffersService) {}

  /**
   * Merchant: Create a new offer
   */
  @Post()
  @UseGuards(JwtAuthGuard)
  async createOffer(
    @Body() createOfferDto: CreateOfferDto,
    @CurrentUser() user: any,
  ) {
    this.logger.log(`Merchant ${user.id} creating offer: ${createOfferDto.title}`);

    if (user.accountType !== 'merchant') {
      throw new ForbiddenException('Only merchants can create offers');
    }

    try {
      const offer = await this.offersService.createOffer(user.id, createOfferDto);
      return {
        success: true,
        message: 'Offer created successfully',
        data: offer,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error creating offer: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to create offer');
    }
  }

  /**
   * Merchant: Get all offers for the merchant
   */
  @Get('merchant')
  @UseGuards(JwtAuthGuard)
  async getMerchantOffers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @CurrentUser() user: any,
  ) {
    if (user.accountType !== 'merchant') {
      throw new ForbiddenException('Only merchants can view their offers');
    }

    try {
      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new BadRequestException('Invalid page or limit parameters');
      }

      const skip = (pageNum - 1) * limitNum;
      const { data, total } = await this.offersService.getOffersByMerchant(
        user.id,
        skip,
        limitNum,
      );

      return {
        success: true,
        data,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error fetching merchant offers: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to fetch offers');
    }
  }

  /**
   * Merchant: Get offer statistics
   */
  @Get('merchant/stats')
  @UseGuards(JwtAuthGuard)
  async getMerchantStats(@CurrentUser() user: any) {
    if (user.accountType !== 'merchant') {
      throw new ForbiddenException('Only merchants can view stats');
    }

    try {
      const stats = await this.offersService.getMerchantStats(user.id);
      return { success: true, data: stats };
    } catch (error) {
      this.logger.error(`Error fetching merchant stats: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to fetch stats');
    }
  }

  /**
   * Public: Get all active offers
   */
  @Get()
  async getPublicOffers(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    try {
      const pageNum = parseInt(String(page), 10);
      const limitNum = parseInt(String(limit), 10);

      if (isNaN(pageNum) || isNaN(limitNum) || pageNum < 1 || limitNum < 1) {
        throw new BadRequestException('Invalid page or limit parameters');
      }

      const skip = (pageNum - 1) * limitNum;
      const { data, total } = await this.offersService.getPublicOffers(skip, limitNum);

      return {
        success: true,
        data,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          pages: Math.ceil(total / limitNum),
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error fetching public offers: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to fetch offers');
    }
  }

  /**
   * Get single offer by ID
   */
  @Get(':offerId')
  async getOffer(@Param('offerId') offerId: string) {
    try {
      const offer = await this.offersService.getOffer(offerId);
      return { success: true, data: offer };
    } catch (error) {
      this.logger.error(`Error fetching offer: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to fetch offer');
    }
  }

  /**
   * Merchant: Update an offer
   */
  @Put(':offerId')
  @UseGuards(JwtAuthGuard)
  async updateOffer(
    @Param('offerId') offerId: string,
    @Body() updateOfferDto: UpdateOfferDto,
    @CurrentUser() user: any,
  ) {
    if (user.accountType !== 'merchant') {
      throw new ForbiddenException('Only merchants can update offers');
    }

    try {
      const offer = await this.offersService.updateOffer(offerId, user.id, updateOfferDto);
      return {
        success: true,
        message: 'Offer updated successfully',
        data: offer,
      };
    } catch (error) {
      this.logger.error(`Error updating offer: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to update offer');
    }
  }

  /**
   * Merchant: Delete an offer
   */
  @Delete(':offerId')
  @UseGuards(JwtAuthGuard)
  async deleteOffer(
    @Param('offerId') offerId: string,
    @CurrentUser() user: any,
  ) {
    if (user.accountType !== 'merchant') {
      throw new ForbiddenException('Only merchants can delete offers');
    }

    try {
      await this.offersService.deleteOffer(offerId, user.id);
      return {
        success: true,
        message: 'Offer deleted successfully',
      };
    } catch (error) {
      this.logger.error(`Error deleting offer: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to delete offer');
    }
  }

  /**
   * Search offers
   */
  @Get('search/:query')
  async searchOffers(@Param('query') query: string) {
    try {
      const offers = await this.offersService.searchOffers(query);
      return { success: true, data: offers };
    } catch (error) {
      this.logger.error(`Error searching offers: ${error.message}`);
      throw new BadRequestException(error.message || 'Failed to search offers');
    }
  }
}
