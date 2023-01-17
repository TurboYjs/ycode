import {
  BodyParam,
  Get,
  HeaderParam,
  JsonController,
  Post,
  QueryParam,
} from 'routing-controllers';
import { redisStore } from '../config/redis';
import { Ip } from '../middleware/decorator/Ip';
import prisma from '../config/prisma';
import IP2Region from 'ip2region';
import logger from '../logger';
import uaparser from 'ua-parser-js';
import { stat } from '@prisma/client';
import { uniqBy } from 'lodash';
import { wrapDayjs } from '../utils/helper';
import { Channel, ChannelText } from '../utils/type';

const IP_PREFIX = 'ip_';

interface StatRes extends stat {
  os: string;
}

@JsonController('/stat')
export class StatController {
  @Get('/')
  async getStat(
    @QueryParam('startAt', { required: true }) startAt: string,
    @QueryParam('endAt', { required: true }) endAt: string,
  ) {
    logger.info('/stat GET query startAt: %s ,endAt: %s', startAt, endAt);
    try {
      const list = await prisma.stat.findMany({
        where: {
          createdAt: {
            lte: wrapDayjs(endAt).toISOString(),
            gte: wrapDayjs(startAt).toISOString(),
          },
        },
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      const uniqList = uniqBy(list.reverse(), (x) => x.ip);
      const uv = uniqList.length;
      const pv = list.length;

      const parseList = uniqList.map((o) => {
        const ua = uaparser(o.userAgent ?? '');
        const browser = ua?.browser?.name ?? 'Unknown';
        const os = ua?.os?.name ?? 'Unknown';
        const device = ua?.device?.model ?? 'Unknown';
        const engine = ua?.engine?.name ?? 'Unknown';
        return { ...o, browser, os, device, engine };
      }) as StatRes[];

      const channelStat: Record<string, number> = {};

      const sourceStat: Record<string, number> = {};

      const [osStats, countryStats, provinceStats, cityStats] =
        parseList.reduce<
          [
            Record<string, number>,
            Record<string, number>,
            Record<string, number>,
            Record<string, number>,
          ]
        >(
          (acc, cur) => {
            const { os, country, province, city, channel, source } = cur;
            if (os) {
              if (!acc[0][os]) {
                acc[0][os] = 1;
              } else {
                acc[0][os]++;
              }
            }

            [country, province, city].forEach((value, index) => {
              const idx = index + 1;
              if (!value) value = 'Unknown';
              if (!acc[idx][value]) {
                acc[idx][value] = 1;
              } else {
                acc[idx][value]++;
              }
            });

            const curCount =
              channelStat[ChannelText[channel as Channel] || ChannelText[0]];

            let hostname = '';
            try {
              const url = new URL(source || '');
              hostname = url?.hostname;
            } catch (error) {}

            if (channel === 0 && hostname) {
              channelStat['Unknown channels'] = (channelStat['Unknown channels'] || 0) + 1;
              sourceStat[hostname] = (sourceStat[hostname] || 0) + 1;
            } else if (curCount) {
              channelStat[ChannelText[channel as Channel]]++;
            } else {
              channelStat[ChannelText[channel as Channel]] = 1;
            }

            return acc;
          },
          [{}, {}, {}, {}],
        );
      const list7 = await prisma.stat.findMany({
        where: {
          createdAt: {
            lte: wrapDayjs(endAt).toISOString(),
            gte: wrapDayjs(endAt).subtract(3, 'd').add(1, 's').toISOString(),
          },
        },
        distinct: ['ip'],
        orderBy: [
          {
            createdAt: 'desc',
          },
        ],
      });

      interface UvStat {
        date: string;
        value: number;
      }

      const uvStats: UvStat[] = [
        { date: wrapDayjs(endAt).format('YYYY-MM-DD'), value: 0 },

        {
          date: wrapDayjs(endAt).subtract(1, 'd').format('YYYY-MM-DD'),
          value: 0,
        },
        {
          date: wrapDayjs(endAt).subtract(2, 'd').format('YYYY-MM-DD'),
          value: 0,
        },
      ];

      list7.reverse().forEach((stat) => {
        const { createdAt } = stat;

        const diff = wrapDayjs(endAt).diff(createdAt, 'd');
        uvStats[diff].value++;
      });

      return {
        code: 0,
        data: {
          stats: {
            uv,
            pv,
          },
          os: Object.entries(osStats).map(([os, value]) => ({
            type: os,
            value,
          })),
          uv: uvStats,
          province: Object.entries(provinceStats).map(([province, value]) => ({
            type: province,
            value,
          })),
          country: Object.entries(countryStats).map(([country, value]) => ({
            type: country,
            value,
          })),
          city: Object.entries(cityStats).map(([city, value]) => ({
            type: city,
            value,
          })),
          channel: Object.entries(channelStat).map(([key, value]) => ({
            type: key,
            value,
          })),
          source: Object.entries(sourceStat).map(([key, value]) => ({
            type: key,
            value,
          })),
        },
      };
    } catch (error: any) {
      logger.error('stats 查询出错', error.message);
      return {
        code: 1,
        message: error.message,
      };
    }
  }

  @Post('/visit')
  async visit(
    @Ip() ip: string,
    @HeaderParam('User-Agent') userAgent: string,
    @BodyParam('createdAt', { required: true }) createdAt: string,
    @BodyParam('channel') channel: number,
    @BodyParam('source') source: string,
  ) {
    logger.info('/visit POST body createdAt: %s', createdAt);
    if (!ip) {
      return {
        code: 0,
      };
    }
    try {
      const ipCache = await redisStore.get(IP_PREFIX + ip);

      logger.info(`ip: ${ip}, 存在缓存，跳过 visit`);

      if (ipCache !== null) {
        return {
          code: 0,
          message: '缓存中',
        };
      }

      const query = new IP2Region();
      const region = query.search(ip);
      const { country, city, province, isp } = region ?? {};

      await redisStore.set(IP_PREFIX + ip, '1');
      await redisStore.expire(IP_PREFIX + ip, 60);

      await prisma.stat.create({
        data: {
          ip,
          country,
          city,
          province,
          isp,
          userAgent,
          channel,
          source,
          createdAt: wrapDayjs(createdAt).toISOString(),
        },
      });
    } catch (error: any) {
      logger.error(`visit error, ${error?.message}`);
      return {
        code: 0,
        message: error?.message,
      };
    }

    logger.info(`ip: ${ip}, visit`);

    return {
      code: 0,
      message: 'success!',
    };
  }
}
