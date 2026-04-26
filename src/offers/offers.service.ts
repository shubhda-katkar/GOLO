import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Offer, OfferDocument } from './schemas/offer.schema';
import { CreateOfferDto, UpdateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  private readonly logger = new Logger(OffersService.name);

  constructor(
    @InjectModel(Offer.name) private offerModel: Model<OfferDocument>,
  ) {}

  async createOffer(merchantId: string, createOfferDto: CreateOfferDto): Promise<Offer> {
    const offerId = uuidv4();

    const newOffer = new this.offerModel({
      offerId,
      merchantId,
      ...createOfferDto,
    });

    return newOffer.save();
  }

  async updateOffer(offerId: string, merchantId: string, updateOfferDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.offerModel.findOneAndUpdate(
      { _id: offerId, merchantId },
      updateOfferDto,
      { new: true },
    );

    if (!offer) {
      throw new NotFoundException('Offer not found or unauthorized');
    }

    return offer;
  }

  async getOffer(offerId: string): Promise<Offer> {
    const offer = await this.offerModel.findById(offerId).populate('products');
    if (!offer) {
      throw new NotFoundException('Offer not found');
    }
    return offer;
  }

  async getOffersByMerchant(
    merchantId: string,
    skip: number = 0,
    limit: number = 20,
  ): Promise<{ data: Offer[]; total: number }> {
    const offers = await this.offerModel
      .find({ merchantId, isVisible: true })
      .skip(skip)
      .limit(limit)
      .populate('products')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const total = await this.offerModel.countDocuments({
      merchantId,
      isVisible: true,
    });

    return { data: offers, total };
  }

  async searchOffers(query: string, merchantId?: string): Promise<Offer[]> {
    const searchFilter: any = {
      isVisible: true,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { offerType: { $regex: query, $options: 'i' } },
      ],
    };

    if (merchantId) {
      searchFilter.merchantId = merchantId;
    }

    return this.offerModel
      .find(searchFilter)
      .limit(10)
      .populate('products')
      .lean()
      .exec();
  }

  async deleteOffer(offerId: string, merchantId: string): Promise<Offer> {
    const offer = await this.offerModel.findOneAndUpdate(
      { _id: offerId, merchantId },
      { isVisible: false, status: 'inactive' },
      { new: true },
    );

    if (!offer) {
      throw new NotFoundException('Offer not found or unauthorized');
    }

    return offer;
  }

  async getMerchantStats(merchantId: string): Promise<any> {
    const offers = await this.offerModel
      .find({ merchantId, isVisible: true })
      .lean()
      .exec();

    const activeOffers = offers.filter((o) => o.status === 'active').length;
    const totalRedeemed = offers.reduce((sum, o) => sum + (o.redeemed || 0), 0);
    const avgRating =
      offers.length > 0
        ? (offers.reduce((sum, o) => sum + (o.rating || 0), 0) / offers.length).toFixed(1)
        : 0;

    return {
      totalOffers: offers.length,
      activeOffers,
      totalRedeemed,
      avgRating,
    };
  }

  async getPublicOffers(
    skip: number = 0,
    limit: number = 20,
  ): Promise<{ data: Offer[]; total: number }> {
    const now = new Date();

    const offers = await this.offerModel
      .find({
        isVisible: true,
        status: 'active',
        validFrom: { $lte: now },
        validTo: { $gte: now },
      })
      .skip(skip)
      .limit(limit)
      .populate('products')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const total = await this.offerModel.countDocuments({
      isVisible: true,
      status: 'active',
      validFrom: { $lte: now },
      validTo: { $gte: now },
    });

    return { data: offers, total };
  }
}
