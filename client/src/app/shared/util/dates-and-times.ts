
export function parseISODateLocal(isoLocalDate: String) {
   const comps = isoLocalDate.split(/\D/);
   return new Date(parseInt(comps[0]), parseInt(comps[1]) - 1, parseInt(comps[2]));
}

export function parseISOTimestampLocal(isoLocalTimestamp: String) {
   const comps = isoLocalTimestamp.split(/\D/);
   return new Date(
      parseInt(comps[0]), parseInt(comps[1]) - 1, parseInt(comps[2]),
      parseInt(comps[3]), parseInt(comps[4]), parseInt(comps[5]), parseInt(comps[6])
   );
}
