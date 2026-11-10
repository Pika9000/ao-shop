
/**
 * Cấu trúc response chung của API
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

/**
 * Cấu trúc phân trang
 */
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Response danh sách có phân trang
 */
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: Pagination;
}

/**
 * Lỗi trả về từ API
 */
export interface ApiError {
  success: false;
  message: string;
}
