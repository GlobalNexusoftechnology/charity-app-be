import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Users, UserStatus } from './entities/user.entity';
// import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';
import { Donations } from 'src/payment/entity/donation.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(Users) private userRepository: Repository<Users>,
    @InjectRepository(Donations)
    private donationRepository: Repository<Donations>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      // const { password, ...rest } = createUserDto;
      // const hashPassword = await bcrypt.hash(password, 10);

      const record = this.userRepository.create({
        ...createUserDto,
        role_id: process.env.SUBSCRIBER,
        // password: hashPassword,
      });
      record.created_on = Math.floor(Date.now() / 1000);
      return await this.userRepository.save(record);
    } catch (error) {
      console.log('[Create User]:', error);
      throw error;
    }
  }

  async findAll() {
    return await this.userRepository.find({
      where: {
        deleted: false,
      },
    });
  }

  async findOne(phone_number: string) {
    return await this.userRepository.findOne({
      where: {
        phone_number,
        deleted: false,
      },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          deleted: false,
        },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      user.modified_on = Math.floor(Date.now() / 1000);
      await this.userRepository.update(id, updateUserDto);
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      console.log('[Update User]:', error);
      throw error;
    }
  }

  async deactivateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          status: UserStatus.ACTIVE,
        },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      user.modified_on = Math.floor(Date.now() / 1000);
      await this.userRepository.update(id, updateUserDto);
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      console.log('[Update User]:', error);
      throw error;
    }
  }

  async activateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.userRepository.findOne({
        where: {
          id,
          status: UserStatus.INACTIVE,
        },
      });
      if (!user) {
        throw new BadRequestException('User does not exist');
      }
      user.modified_on = Math.floor(Date.now() / 1000);
      await this.userRepository.update(id, updateUserDto);
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      console.log('[Update User]:', error);
      throw error;
    }
  }

  async remove(id: string) {
    return await this.userRepository.update(id, { deleted: true });
  }

  async savePushToken(userId: string, token: string) {
    await this.userRepository.update(userId, {
      expo_push_token: token,
    });
  }

  // Report
  async report() {
    const reqYear = 2026; // the year you want to analyze

    const usersCount = await this.userRepository.count();

    const result = await this.donationRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .getRawOne();

    const totalDonationsAmount = Number(result.total) || 0;

    const recurringAmount = await this.donationRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.frequency = :freq', { freq: 'Recurring' })
      .getRawOne();

    const totalRecurringAmount = Number(recurringAmount.total) || 0;

    const onetimeAmount = await this.donationRepository
      .createQueryBuilder('donation')
      .select('SUM(donation.amount)', 'total')
      .where('donation.frequency = :freq', { freq: 'One-Time' })
      .getRawOne();

    const totalOneTimeAmount = Number(onetimeAmount.total) || 0;

    const donationsByMonthRaw = await this.donationRepository
      .createQueryBuilder('donation')
      .select("TO_CHAR(donation.created_at, 'Month')", 'month')
      .addSelect('SUM(donation.amount)', 'total')
      .where('donation.frequency = :freq', { freq: 'Recurring' })
      .andWhere('EXTRACT(YEAR FROM donation.created_at) = :year', {
        year: reqYear,
      })
      .groupBy("TO_CHAR(donation.created_at, 'Month')")
      .orderBy('MIN(EXTRACT(MONTH FROM "donation"."created_at"))')
      .getRawMany();

    // Convert to object { monthName: totalAmount }
    const donationsByMonth = donationsByMonthRaw.reduce((acc, curr) => {
      acc[curr.month.trim()] = Number(curr.total) || 0;
      return acc;
    }, {});

    const donations = await this.donationRepository.find({
      where: [{ status: 'PENDING' }, { status: 'SUCCESS' }],
    });

    // Separate into two arrays
    const pendingDonations = donations.filter((d) => d.status === 'PENDING');
    const successDonations = donations.filter((d) => d.status === 'SUCCESS');

    // const monthlyUsersRaw = await this.userRepository
    //   .createQueryBuilder('user')
    //   .select("TO_CHAR(user.created_at, 'Month')", 'month')
    //   .addSelect('COUNT(user.id)', 'count')
    //   .where('EXTRACT(YEAR FROM user.created_at) = :year', {
    //     year: reqYear,
    //   })
    //   .groupBy("TO_CHAR(user.created_at, 'Month')")
    //   .orderBy('MIN(EXTRACT(MONTH FROM "user"."created_at"))')
    //   .getRawMany();

    // // Convert to object { monthName: count }
    // const monthlyUsers = monthlyUsersRaw.reduce((acc, curr) => {
    //   acc[curr.month.trim()] = Number(curr.count) || 0;
    //   return acc;
    // }, {});

    const reportData = {
      pendingDonations,
      successDonations,
      donationsByMonth,
      totalOneTimeAmount,
      totalDonationsAmount,
      usersCount,
      // monthlyUsers,
      totalRecurringAmount,
    };

    console.log('[REPORT DATA]', reportData);

    return reportData;
  }
}
