import { get } from '../../../../utils/request';

export const findInst = (query) => {
  return get(`v1/api/sys/institution`, query);
};
export const findProducts = (query) => {
  return get(`v1/api/sys/product`, query);
};
export const findPrizes = (query) => {
  return get(`v1/api/sys/prizes/findByName`, query);
};
export const findMissionPrize = (query) => {
  return get(`v1/api/sys/mission/missionPrize/findByName`, query);
};
export const findGatheringProducts = (query) => {
  return get(`v1/api/sys/gathering/gatheringProduct/findByName`, query);
};