// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CMS } from "@/lib/lib";
import type { NextApiResponse } from "next";

export default async function handler(_: any, res: NextApiResponse<any>) {
  res.status(200).json(await CMS._tmp_getProductsWithError());
}
