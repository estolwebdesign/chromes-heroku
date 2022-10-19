export const diff_years = (dt1, dt2) => {
  let diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60 * 24;
  
  return Math.abs(Math.round(diff / 365.25));
};
