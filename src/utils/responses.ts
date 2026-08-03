import { Response } from "express"
interface PaginationData<T> {
  data: T[];
  total: number;
  page: number | string;
  limit: number | string;
}
export const success =(res:Response,data: Record<string, unknown> = {},message: string = "Success",statusCode:number=200)=>res.status(statusCode).json({success:true,message,...data});

export const created=(res:Response,data: Record<string, unknown> = {},message: string = "Success",statusCode:number=201)=>res.status(statusCode).json({success:true,message,...data});

export const error=(res:Response, message:string='An error ocurred',statusCode:number=400, errors: Record<string,unknown> |null=null)=>res.status(statusCode).json({success:false,message,...(errors && {errors})});

export const paginated = <T>(
  res: Response,
  { data, total, page, limit }: PaginationData<T>,
  message: string = "Success"
) =>
  res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
      hasNext: Number(page) * Number(limit) < total,
      hasPrev: Number(page) > 1
    }
  });
  exports.default = {
    success,
    error,
    created,
    paginated
  };