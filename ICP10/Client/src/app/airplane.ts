export class Airplane {
  identifier: string;
  callSign?: string;
  countryName: string;
  lastPositionUpdate?: number | Date;
  lastUpdate: number | Date;
  longitude?: number;
  latitude?: number;
  barometricAltitude?: number;
  isOnGround: boolean;
  velocity?: number;
  trueTrack?: number;
  verticalRate?: number;
  sensors?: number[];
  geometricAltitude?: number;
  squawk?: string;
  isSpecialPurposeIndicator: boolean;
  source: string;
  time: number | Date;
}
