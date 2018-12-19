export function getAuthority() {
  return JSON.parse(sessionStorage.getItem('authority'));
}

export function setAuthority(authority) {
  return sessionStorage.setItem('authority', JSON.stringify(authority));
}
export function checkAuthority(limitAuthorityArr, reverse, allM) {
  if (reverse) {
    return auths => {
      if (!auths) {
        return true;
      }
      if (allM) {
        const sameLen = limitAuthorityArr.length === auths.length;
        const allMatch = limitAuthorityArr.every(a => auths && auths.includes(a));
        return !(sameLen && allMatch);
      }
      return !limitAuthorityArr.some(a => auths && auths.includes(a));
    };
  }
  return auths => {
    if (!auths) {
      return true;
    }
    if (allM) {
      const sameLen = limitAuthorityArr.length === auths.length;
      const allMatch = limitAuthorityArr.every(a => auths && auths.includes(a));
      return sameLen && allMatch;
    }
    return limitAuthorityArr.some(a => auths && auths.includes(a));
  };
}
