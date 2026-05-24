import { TFunction } from 'i18next';
import { getTrainType } from './helpers';
import type { Leg } from './types';

export interface CarriageDef {
  type: string;
  shortLabel: string;
  grossraum: boolean;
  isDogFriendly?: boolean;
  dogSeats?: number[];
  carriageNumber?: string;
  typeName?: string;
}

interface CompositionSection {
  title: string;
  carriages: CarriageDef[];
}

const gross1st = (t: TFunction): CarriageDef => ({
  type: '1st-gross',
  shortLabel: t('composition.labels.firstClass'),
  grossraum: true,
  isDogFriendly: true,
});

const gross2nd = (t: TFunction, seats?: number[]): CarriageDef => ({
  type: '2nd-gross',
  shortLabel: t('composition.labels.secondClass'),
  grossraum: true,
  isDogFriendly: true,
  dogSeats: seats,
});

const mehrzweck = (t: TFunction, seats?: number[]): CarriageDef => ({
  type: 'mehrzweck',
  shortLabel: t('composition.labels.mehrzweck'),
  grossraum: true,
  isDogFriendly: true,
  dogSeats: seats,
});

export function getFallbackCompositionSections(leg: Leg, t: TFunction): CompositionSection[] {
  const trainType = getTrainType(leg);
  const product = (leg.line?.product || '').toLowerCase();
  const name = (leg.line?.name || '').toLowerCase();
  
  if (trainType === 'ice' || name.startsWith('ice')) {
    return [
      {
        title: t('composition.trains.ice'),
        carriages: [
          gross1st(t),
          gross1st(t),
          { type: 'bistro', shortLabel: t('composition.labels.bistro'), grossraum: false, isDogFriendly: false },
          { type: 'familie', shortLabel: t('composition.labels.familie'), grossraum: true, isDogFriendly: false },
          gross2nd(t, [3, 4, 11, 12]),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
        ],
      },
    ];
  }

  if (
    trainType === 'ic' || 
    trainType === 'ec' || 
    product === 'flx' || 
    product === 'national' ||
    name.startsWith('ic') || 
    name.startsWith('ec') || 
    name.startsWith('flx')
  ) {
    if (name.includes('20') || name.includes('24')) {
      return [
        {
          title: t('composition.trains.ic2'),
          carriages: [
            { type: 'loco', shortLabel: t('composition.labels.lok'), grossraum: false, isDogFriendly: false },
            gross1st(t),
            { type: 'bistro', shortLabel: t('composition.labels.cafe'), grossraum: false, isDogFriendly: false },
            gross2nd(t, [1, 2, 5, 6]),
            gross2nd(t),
            gross2nd(t),
          ],
        }
      ];
    }
    return [
      {
        title: t('composition.trains.ic1'),
        carriages: [
          { type: 'loco', shortLabel: t('composition.labels.lok'), grossraum: false, isDogFriendly: false },
          gross1st(t),
          { type: 'bistro', shortLabel: t('composition.labels.bistro'), grossraum: false, isDogFriendly: false },
          { type: 'abteil', shortLabel: t('composition.labels.abteil'), grossraum: false, isDogFriendly: false },
          gross2nd(t, [5, 6, 11, 12]),
          gross2nd(t),
          gross2nd(t),
          gross2nd(t),
        ],
      },
    ];
  }

  return [
    {
      title: t('composition.trains.re1'),
      carriages: [
        mehrzweck(t, [1, 2, 3, 4]),
        gross2nd(t),
        gross2nd(t),
        gross1st(t),
      ],
    },
    {
      title: t('composition.trains.re2'),
      carriages: [
        mehrzweck(t),
        gross2nd(t),
        gross2nd(t),
        gross1st(t),
      ],
    },
  ];
}

export function getDogSeatingAdvice(leg: Leg, t: TFunction) {
  const name = (leg.line?.name || '').toLowerCase();
  const product = (leg.line?.product || '').toLowerCase();
  const trainType = getTrainType(leg);

  if (trainType === 'ice' || name.startsWith('ice')) {
    return {
      zone: t('composition.advice.iceZone'),
      seats: t('composition.advice.iceSeats'),
      tip: t('composition.advice.iceTip')
    };
  }

  if (
    trainType === 'ic' || 
    trainType === 'ec' || 
    product === 'flx' || 
    name.startsWith('ic') || 
    name.startsWith('ec') || 
    name.startsWith('flx')
  ) {
    if (name.includes('20') || name.includes('24')) {
      return {
        zone: t('composition.advice.ic2Zone'),
        seats: t('composition.advice.ic2Seats'),
        tip: t('composition.advice.ic2Tip')
      };
    }
    return {
      zone: t('composition.advice.ic1Zone'),
      seats: t('composition.advice.ic1Seats'),
      tip: t('composition.advice.ic1Tip')
    };
  }

  return {
    zone: t('composition.advice.regioZone'),
    seats: t('composition.advice.regioSeats'),
    tip: t('composition.advice.regioTip')
  };
}