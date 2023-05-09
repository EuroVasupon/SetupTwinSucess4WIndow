export default class Pagination {
  pageNo: number;
  limit: number;

  constructor(pageNo: any, limit: any) {
    this.pageNo = this.convertPageNo(pageNo, 0);
    this.limit = this.convertLimit(limit, 10);
  }

  convertPageNo(pageNo: any, isDefault: number) {
    if (pageNo && typeof pageNo === 'string' && parseInt(pageNo)) {
      return parseInt(pageNo) - 1;
    } else if (typeof pageNo === 'number') {
      return pageNo - 1;
    }
    return isDefault;
  }

  convertLimit(limit: any, isDefault: number) {
    if (limit && typeof limit === 'string' && parseInt(limit)) {
      return parseInt(limit);
    } else if (typeof limit === 'number') {
      return limit;
    }

    return isDefault;
  }

  getLimit(): number {
    return this.limit;
  }

  getOffset(): number {
    return this.pageNo * this.limit;
  }

  getPagination(count: number) {
    return {
      pageNo: this.pageNo + 1,
      pageCount: Math.ceil(count / this.limit),
      pageSize: this.limit,
      total: count
    };
  }
}
