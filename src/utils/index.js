export const truncate = (addr) => {
    var sep = '...';
    var front = addr.substr(0, 10);
    var back = addr.substr(addr.length - 4);
    return front + sep + back;
  };
  