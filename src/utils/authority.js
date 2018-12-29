export function getAuthority() {
  const authority = sessionStorage.getItem('authority');
  console.log('authority', authority)
  if (authority !== 'undefined') {
    console.log('wokao', authority)
    return JSON.parse(authority);
  }
  return null
}

export function setAuthority(authority) {
  return sessionStorage.setItem('authority', JSON.stringify(authority));
}
export function checkAuthority(limitAuthorityArr, reverse, allM) {
  console.log('limitAuthorityArr', limitAuthorityArr)
  if (reverse) {
    return (auths) => {
      console.log('auths', auths)
      if (!auths) {
        return true;
      }
      if (allM) {
        const sameLen = limitAuthorityArr.length === auths.length;
        const allMatch = limitAuthorityArr.every((a) => auths && auths.includes(a));
        return !(sameLen && allMatch);
      }
      return !limitAuthorityArr.some((a) => auths && auths.includes(a));
    };
  }
  return (auths) => {
    if (!auths) {
      return true;
    }
    if (allM) {
      const sameLen = limitAuthorityArr.length === auths.length;
      const allMatch = limitAuthorityArr.every((a) => auths && auths.includes(a));
      return sameLen && allMatch;
    }
    return limitAuthorityArr.some((a) => auths && auths.includes(a));
  };
}
